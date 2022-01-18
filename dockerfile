FROM node:15.0.0-alpine

RUN apk add git

# set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install 

# add app
COPY . ./

# start app
CMD ["yarn", "start"]