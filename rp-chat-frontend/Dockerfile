# To build
# docker image build -t frontend-chat .
# docker run -p 8000:8000 -d frontend-chat
# docker tag frontend-chat frontend-chat
# docker push frontend-chat

FROM node:18.2.0-alpine
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT 3000
EXPOSE 3000

CMD ["npm", "run", "start"]