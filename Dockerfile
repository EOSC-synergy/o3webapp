FROM node:18-alpine as base

WORKDIR /app

COPY ["package.json", "yarn.lock", "next.config.js", "next-env.d.ts", "tsconfig.json", ".eslintrc.json", ".prettierrc", "./"]
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn install
# copy necessary files
COPY [".env", "./"]
COPY public public
COPY styles styles
COPY pages pages
COPY src src

FROM base as prod-build
# relative
ARG BACKEND_URL=api/v1
ENV NEXT_PUBLIC_API_HOST=${BACKEND_URL}

RUN yarn build

FROM node:18-alpine as production
ENV NODE_ENV=production

WORKDIR /app
COPY --from=prod-build /app/package.json .
COPY --from=prod-build /app/yarn.lock .
COPY --from=prod-build /app/next.config.js .
COPY --from=prod-build /app/public ./public
COPY --from=prod-build /app/.next/static ./.next/static
COPY --from=prod-build /app/.next/standalone ./

EXPOSE 3000
CMD ["node", "server.js"]

FROM base as development
ENV NODE_ENV=development
# relative
ARG BACKEND_URL=api/v1
ENV NEXT_PUBLIC_API_HOST=${BACKEND_URL}

EXPOSE 3000
CMD [ "yarn", "dev" ]
