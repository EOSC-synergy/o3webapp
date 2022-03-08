FROM node:16.13-alpine
WORKDIR /o3webapp
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm run build
CMD ["npm", "run", "build"]
