FROM node:lts as build-frontend

WORKDIR /frontend

RUN npm install -g pnpm

COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./

RUN pnpm install

COPY ./frontend ./

RUN pnpm run build

FROM rust:1 as build-rust

RUN cargo new --bin /app

WORKDIR /app

COPY ./Cargo.toml ./Cargo.lock ./

RUN cargo build --release

RUN rm src/*.rs

COPY ./src ./src

RUN mkdir ./frontend

COPY --from=build-frontend /frontend/dist ./frontend/dist

RUN rm ./target/release/deps/mc_stats_leaderboard*

RUN cargo build --release

FROM debian:stable-slim as runner

WORKDIR /app

RUN apt-get update && apt-get install -y libssl-dev ca-certificates

COPY --from=build-rust /app/target/release/mc_stats_leaderboard .

CMD ["./mc_stats_leaderboard", "/data/"]