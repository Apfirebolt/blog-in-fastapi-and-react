import asyncio
from datetime import date
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from blog import router as blog_router
from blog import schema as blog_schema
from blog import services as blog_services


class FakeQueryFilterBy:
    def __init__(self, first_result=None, all_result=None):
        self._first_result = first_result
        self._all_result = all_result if all_result is not None else []

    def filter_by(self, **_kwargs):
        return self

    def first(self):
        return self._first_result

    def all(self):
        return self._all_result


class FakeQueryFilter:
    def __init__(self, all_result=None):
        self.filters_count = 0
        self._all_result = all_result if all_result is not None else []

    def filter(self, *_args, **_kwargs):
        self.filters_count += 1
        return self

    def all(self):
        return self._all_result


class FakeDBForBlogById:
    def __init__(self, blog_obj):
        self._blog_obj = blog_obj

    def query(self, _model):
        return FakeQueryFilterBy(first_result=self._blog_obj)


class FakeDBForBlogList:
    def __init__(self, blogs):
        self._blogs = blogs

    def query(self, _model):
        return FakeQueryFilterBy(all_result=self._blogs)


class FakeDBForCommentsFilter:
    def __init__(self, comments):
        self.query_obj = FakeQueryFilter(all_result=comments)

    def query(self, _model):
        return self.query_obj


class FakeExecuteResult:
    def __init__(self, inserted_primary_key=None, rowcount=0, scalar_obj=None, all_rows=None):
        self.inserted_primary_key = inserted_primary_key
        self.rowcount = rowcount
        self._scalar_obj = scalar_obj
        self._all_rows = all_rows if all_rows is not None else []

    def scalar_one_or_none(self):
        return self._scalar_obj

    def all(self):
        return self._all_rows


class FakeDBForExecute:
    def __init__(self, execute_results):
        self._execute_results = list(execute_results)
        self.commit_called = 0

    def execute(self, _statement):
        if not self._execute_results:
            raise AssertionError("Unexpected execute() call without prepared result")
        return self._execute_results.pop(0)

    def commit(self):
        self.commit_called += 1


class FakeDBForObjectLifecycle:
    def __init__(self):
        self.added = []
        self.commits = 0
        self.refreshed = []

    def add(self, obj):
        self.added.append(obj)

    def commit(self):
        self.commits += 1

    def refresh(self, obj):
        self.refreshed.append(obj)


class DummyCommentRequest:
    def __init__(self, content):
        self.content = content


class DummyBlogRequest:
    def __init__(self, title=None, content=None):
        self.title = title
        self.content = content


def test_get_blog_by_id_returns_blog_when_found():
    blog_obj = SimpleNamespace(id=5, title="t", content="c")
    db = FakeDBForBlogById(blog_obj)

    result = asyncio.run(blog_services.get_blog_by_id(5, 1, db))

    assert result.id == 5


def test_get_blog_by_id_raises_404_when_missing():
    db = FakeDBForBlogById(None)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(blog_services.get_blog_by_id(999, 1, db))

    assert exc.value.status_code == 404


def test_get_blog_listing_returns_all_blogs():
    blogs = [SimpleNamespace(id=1), SimpleNamespace(id=2)]
    db = FakeDBForBlogList(blogs)

    result = asyncio.run(blog_services.get_blog_listing(db))

    assert result == blogs


def test_create_new_blog_adds_and_returns_blog():
    db = FakeDBForObjectLifecycle()
    request = DummyBlogRequest(title="new-title", content="new-content")
    current_user = SimpleNamespace(id=5)

    result = asyncio.run(blog_services.create_new_blog(request, db, current_user))

    assert result.title == "new-title"
    assert result.content == "new-content"
    assert result.owner_id == 5
    assert len(db.added) == 1
    assert db.commits == 1
    assert len(db.refreshed) == 1


def test_get_all_comments_applies_optional_filters_and_returns_list():
    comments = [SimpleNamespace(id=1), SimpleNamespace(id=2)]
    db = FakeDBForCommentsFilter(comments)

    result = asyncio.run(
        blog_services.get_all_comments(
            db,
            owner_id=10,
            blog_id=22,
            date_posted=date(2026, 4, 21),
        )
    )

    assert result == comments
    assert db.query_obj.filters_count == 3


def test_create_new_comment_raises_when_blog_missing():
    class DBNoBlog:
        def query(self, _model):
            return FakeQueryFilterBy(first_result=None)

    db = DBNoBlog()
    current_user = SimpleNamespace(id=1)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(blog_services.create_new_comment(DummyCommentRequest("x"), 99, current_user, db))

    assert exc.value.status_code == 404


def test_create_new_comment_creates_comment_when_blog_exists():
    class DBBlogExists(FakeDBForObjectLifecycle):
        def query(self, _model):
            return FakeQueryFilterBy(first_result=SimpleNamespace(id=10))

    db = DBBlogExists()
    current_user = SimpleNamespace(id=3)

    result = asyncio.run(blog_services.create_new_comment(DummyCommentRequest("hello"), 10, current_user, db))

    assert result.content == "hello"
    assert result.blog_id == 10
    assert result.owner_id == 3
    assert len(db.added) == 1
    assert db.commits == 1
    assert len(db.refreshed) == 1


def test_get_comments_by_blog_id_returns_comments():
    comments = [SimpleNamespace(id=1), SimpleNamespace(id=2)]

    class DBComments:
        def query(self, _model):
            return FakeQueryFilterBy(all_result=comments)

    result = asyncio.run(blog_services.get_comments_by_blog_id(4, DBComments()))

    assert result == comments


def test_get_comments_by_blog_id_raises_404_when_empty():
    class DBNoComments:
        def query(self, _model):
            return FakeQueryFilterBy(all_result=[])

    with pytest.raises(HTTPException) as exc:
        asyncio.run(blog_services.get_comments_by_blog_id(4, DBNoComments()))

    assert exc.value.status_code == 404


def test_sql_create_blog_returns_created_blog():
    created_blog = SimpleNamespace(id=11, title="sql-title", createdDate="2026-04-23", owner_id=2)
    db = FakeDBForExecute(
        execute_results=[
            FakeExecuteResult(inserted_primary_key=[11]),
            FakeExecuteResult(scalar_obj=created_blog),
        ]
    )
    user = SimpleNamespace(id=2)

    result = asyncio.run(blog_services.sql_create_blog(DummyBlogRequest(title="sql-title", content="sql-content"), db, user))

    assert result.id == 11
    assert db.commit_called == 1


def test_sql_create_blog_raises_500_when_insert_pk_missing():
    db = FakeDBForExecute(execute_results=[FakeExecuteResult(inserted_primary_key=[])])
    user = SimpleNamespace(id=2)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(blog_services.sql_create_blog(DummyBlogRequest(title="sql-title", content="sql-content"), db, user))

    assert exc.value.status_code == 500


def test_sql_get_blog_listing_returns_rows():
    rows = [(1, "first", "2026-04-21", 1), (2, "second", "2026-04-22", 2)]
    db = FakeDBForExecute(execute_results=[FakeExecuteResult(all_rows=rows)])

    result = asyncio.run(blog_services.sql_get_blog_listing(db))

    assert result == rows


def test_sql_get_blog_by_id_returns_blog_when_found():
    blog_obj = SimpleNamespace(id=9, title="x")
    db = FakeDBForExecute(execute_results=[FakeExecuteResult(scalar_obj=blog_obj)])

    result = asyncio.run(blog_services.sql_get_blog_by_id(9, db))

    assert result.id == 9


def test_sql_get_blog_by_id_raises_404_when_not_found():
    db = FakeDBForExecute(execute_results=[FakeExecuteResult(scalar_obj=None)])

    with pytest.raises(HTTPException) as exc:
        asyncio.run(blog_services.sql_get_blog_by_id(9, db))

    assert exc.value.status_code == 404


def test_sql_update_blog_by_id_returns_updated_blog_on_success():
    request = blog_schema.BlogUpdate(title="updated", content="new-content")
    updated_blog = SimpleNamespace(id=3, title="updated", content="new-content", owner_id=7)
    db = FakeDBForExecute(
        execute_results=[
            FakeExecuteResult(rowcount=1),
            FakeExecuteResult(scalar_obj=updated_blog),
        ]
    )

    result = asyncio.run(blog_services.sql_update_blog_by_id(request, blog_id=3, user_id=7, database=db))

    assert result == updated_blog
    assert db.commit_called == 1


def test_sql_update_blog_by_id_no_fields_still_returns_selected_blog():
    request = blog_schema.BlogUpdate(title=None, content=None)
    selected_blog = SimpleNamespace(id=5, title="old", content="old-content", owner_id=8)
    db = FakeDBForExecute(execute_results=[FakeExecuteResult(scalar_obj=selected_blog)])

    result = asyncio.run(blog_services.sql_update_blog_by_id(request, blog_id=5, user_id=8, database=db))

    assert result == selected_blog
    assert db.commit_called == 0


def test_sql_update_blog_by_id_raises_when_no_rows_updated():
    request = blog_schema.BlogUpdate(title="new-title", content=None)
    db = FakeDBForExecute(execute_results=[FakeExecuteResult(rowcount=0)])

    with pytest.raises(HTTPException) as exc:
        asyncio.run(blog_services.sql_update_blog_by_id(request, blog_id=1, user_id=99, database=db))

    assert exc.value.status_code == 404


def test_sql_delete_blog_by_id_raises_when_no_rows_deleted():
    db = FakeDBForExecute(execute_results=[FakeExecuteResult(rowcount=0)])

    with pytest.raises(HTTPException) as exc:
        asyncio.run(blog_services.sql_delete_blog_by_id(blog_id=1, user_id=77, database=db))

    assert exc.value.status_code == 404


def test_sql_delete_blog_by_id_commits_on_success():
    db = FakeDBForExecute(execute_results=[FakeExecuteResult(rowcount=1)])

    asyncio.run(blog_services.sql_delete_blog_by_id(blog_id=1, user_id=77, database=db))

    assert db.commit_called == 1


def test_sql_blog_list_route_is_public_and_forwards_to_service(monkeypatch):
    expected = [SimpleNamespace(id=1, title="A", createdDate="2026-04-21", owner_id=10)]

    async def fake_sql_get_blog_listing(database):
        assert database == "fake-db"
        return expected

    monkeypatch.setattr(blog_services, "sql_get_blog_listing", fake_sql_get_blog_listing)

    result = asyncio.run(blog_router.sql_blog_list(database="fake-db"))

    assert result == expected
