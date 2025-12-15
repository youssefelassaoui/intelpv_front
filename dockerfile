FROM node:20-alpine AS build
WORKDIR /app

ARG REACT_APP_API_BASE=https://api.intelligentpv.online/api
ENV REACT_APP_API_BASE=${REACT_APP_API_BASE}

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
