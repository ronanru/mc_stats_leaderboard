FROM node:lts as build-frontend

WORKDIR /frontend

RUN npm install -g pnpm

COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./

RUN pnpm install

COPY ./frontend ./

RUN pnpm run build

FROM rust:1 as build-rust

WORKDIR /app

RUN cargo new --bin /app

COPY ./Cargo.toml ./Cargo.lock ./

RUN cargo build --release

RUN rm src/*.rs

COPY ./src ./src

RUN mkdir ./frontend

COPY --from=build-frontend /frontend/dist/* ./frontend/dist

RUN cargo build --release

FROM debian:stable-slim as runner

WORKDIR /app

COPY --from=build-rust /app/target/release/mc_stats_leaderboard .

CMD ["./mc_stats_leaderboard", "./data/"]