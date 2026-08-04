import asyncio
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from auth import hashing
from auth import jwt as auth_jwt
from auth import router as auth_router
from auth import schema as auth_schema
from auth import services as auth_services


class FakeQuery:
    def __init__(self, user):
        self._user = user

    def filter(self, *_args, **_kwargs):
        return self

    def first(self):
        return self._user


class FakeDBForLogin:
    def __init__(self, user):
        self._user = user

    def query(self, _model):
        return FakeQuery(self._user)


class FakeQueryById:
    def __init__(self, user):
        self._user = user

    def get(self, _user_id):
        return self._user


class FakeDBForGetById:
    def __init__(self, user):
        self._user = user

    def query(self, _model):
        return FakeQueryById(self._user)


def test_password_hash_and_verify_round_trip():
    password = "super-secret"
    hashed = hashing.get_password_hash(password)

    assert hashed != password
    assert hashing.verify_password(password, hashed) is True


def test_password_verify_rejects_wrong_password():
    hashed = hashing.get_password_hash("super-secret")
    assert hashing.verify_password("wrong-password", hashed) is False


def test_create_and_verify_jwt_token_success():
    token = auth_jwt.create_access_token({"sub": "user@example.com", "id": 42})
    credentials_exception = HTTPException(status_code=401, detail="Invalid token")

    token_data = auth_jwt.verify_token(token, credentials_exception)

    assert token_data.email == "user@example.com"
    assert token_data.id == 42


def test_verify_jwt_token_failure_raises_http_exception():
    credentials_exception = HTTPException(status_code=401, detail="Invalid token")

    with pytest.raises(HTTPException) as exc:
        auth_jwt.verify_token("definitely-invalid-token", credentials_exception)

    assert exc.value.status_code == 401


def test_verify_jwt_token_missing_sub_raises_http_exception():
    token = auth_jwt.create_access_token({"id": 7})
    credentials_exception = HTTPException(status_code=401, detail="Invalid token")

    with pytest.raises(HTTPException) as exc:
        auth_jwt.verify_token(token, credentials_exception)

    assert exc.value.status_code == 401


def test_login_success_returns_user_login_model():
    plain_password = "test-password"
    user = SimpleNamespace(
        id=1,
        email="user@example.com",
        username="testuser",
        password=hashing.get_password_hash(plain_password),
    )
    db = FakeDBForLogin(user)
    request = auth_schema.Login(username="user@example.com", password=plain_password)

    response = auth_router.login(request, database=db)

    assert response.id == 1
    assert response.email == "user@example.com"
    assert response.username == "testuser"
    assert isinstance(response.token, str)
    assert len(response.token) > 0


def test_login_user_not_found_raises_404():
    db = FakeDBForLogin(None)
    request = auth_schema.Login(username="missing@example.com", password="password")

    with pytest.raises(HTTPException) as exc:
        auth_router.login(request, database=db)

    assert exc.value.status_code == 404


def test_login_invalid_password_raises_400():
    user = SimpleNamespace(
        id=1,
        email="user@example.com",
        username="testuser",
        password=hashing.get_password_hash("correct-password"),
    )
    db = FakeDBForLogin(user)
    request = auth_schema.Login(username="user@example.com", password="wrong-password")

    with pytest.raises(HTTPException) as exc:
        auth_router.login(request, database=db)

    assert exc.value.status_code == 400


def test_get_user_by_id_returns_user():
    user = SimpleNamespace(id=7, email="user@example.com")
    db = FakeDBForGetById(user)

    result = asyncio.run(auth_services.get_user_by_id(7, db))

    assert result.id == 7


def test_get_user_by_id_not_found_raises_404():
    db = FakeDBForGetById(None)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(auth_services.get_user_by_id(99, db))

    assert exc.value.status_code == 404


def test_create_user_registration_success(monkeypatch):
    request = auth_schema.User(
        username="newuser",
        email="new@example.com",
        firstName="New",
        lastName="User",
        password="secret",
    )

    async def fake_verify_email_exist(email, database):
        assert email == "new@example.com"
        assert database == "fake-db"
        return None

    async def fake_new_user_register(req, database):
        assert req.email == "new@example.com"
        assert database == "fake-db"
        return SimpleNamespace(id=12, email=req.email, username=req.username)

    monkeypatch.setattr(auth_router.validator, "verify_email_exist", fake_verify_email_exist)
    monkeypatch.setattr(auth_router.services, "new_user_register", fake_new_user_register)

    response = asyncio.run(auth_router.create_user_registration(request, database="fake-db"))

    assert response.email == "new@example.com"
    assert response.username == "newuser"
    assert isinstance(response.token, str)


def test_create_user_registration_existing_email_raises_400(monkeypatch):
    request = auth_schema.User(
        username="exists",
        email="exists@example.com",
        firstName="Ex",
        lastName="Ists",
        password="secret",
    )

    async def fake_verify_email_exist(email, database):
        assert email == "exists@example.com"
        assert database == "fake-db"
        return SimpleNamespace(id=99, email=email)

    monkeypatch.setattr(auth_router.validator, "verify_email_exist", fake_verify_email_exist)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(auth_router.create_user_registration(request, database="fake-db"))

    assert exc.value.status_code == 400


def test_get_all_users_route_forwards_to_service(monkeypatch):
    expected = [SimpleNamespace(id=1), SimpleNamespace(id=2)]

    async def fake_all_users(database):
        assert database == "fake-db"
        return expected

    monkeypatch.setattr(auth_router.services, "all_users", fake_all_users)

    response = asyncio.run(auth_router.get_all_users(database="fake-db"))

    assert response == expected


def test_get_profile_route_forwards_to_service(monkeypatch):
    current_user = SimpleNamespace(email="user@example.com")
    expected_profile = SimpleNamespace(id=1, email="user@example.com")

    async def fake_get_profile(database, token_data):
        assert database == "fake-db"
        assert token_data.email == "user@example.com"
        return expected_profile

    monkeypatch.setattr(auth_router.services, "get_profile", fake_get_profile)

    response = asyncio.run(auth_router.get_profile(database="fake-db", current_user=current_user))

    assert response == expected_profile
