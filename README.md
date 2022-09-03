![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)


# Blog App in FastAPI and React

A simple Blog application written using FastAPI for the back-end and React for the frontend. This would have simple blog application features like authentication, posting contents which would have title and description. More features to be added in the future like file upload to local system, file upload to AWS and more.

## Resources

Following resources were used for motivation in designing this API.

- [Fast API Official Website](https://fastapi.tiangolo.com/)
- [Udemy Course - FastAPI](https://www.udemy.com/course/fastapi-the-complete-course/)

## Docker Deployment

- 3/9/22 : Added Docker deployment script for FAST API. 

```
# Build the Docker image from the given file
docker build -t fast-image .
# Run container from the image created
docker run -d -p 80:80 --name my-fast-api fast-image
```

## Authors

* **Amit Prafulla (APFirebolt)** - [My Website](https://apgiiit.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
