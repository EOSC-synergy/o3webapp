FROM node:16.13-alpine AS base
#FROM node:16 as base

WORKDIR /o3webapp
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm install --development

FROM base AS production
ENV NODE_ENV=production
ARG REACT_APP_DEFAULT_REF_MODEL=SBUV_GSFC_observed-merged-SAT-ozone
ENV REACT_APP_DEFAULT_REF_MODEL=$REACT_APP_DEFAULT_REF_MODEL
RUN npm run build
CMD ["npm", "run", "start"]

FROM base AS development
ENV NODE_ENV=development
CMD [ "npm", "run", "dev" ]
