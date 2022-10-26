FROM node:16.13-alpine as base
#FROM node:16 as base

WORKDIR /o3webapp
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm install --development

FROM base as production
ENV NODE_ENV=production
RUN npm run build
CMD ["npm", "run", "start"]

FROM base as development
ENV NODE_ENV=development
CMD [ "npm", "run", "dev" ]
