# ---------- BUILD STAGE ----------
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 🔥 VITE BUILD (THIS IS WHAT WAS MISSING)
RUN npm run build


# ---------- RUNTIME STAGE ----------
FROM node:20

WORKDIR /app

# Serve static build
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
