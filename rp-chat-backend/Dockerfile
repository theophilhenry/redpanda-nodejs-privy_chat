# To build
# docker image build -t backend-chat .
# docker tag backend-chat:latest theojust/theojust:backend-chat
# docker push theojust/theojust:backend-chat

FROM python:3.8
WORKDIR /backend
COPY requirements.txt .
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["flask", "--app", "app", "run", "--host=0.0.0.0", "-p", "5000"]