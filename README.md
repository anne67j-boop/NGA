Application Studio Project – Run and Deploy Guide

Overview

This repository provides all the necessary resources to run and deploy your Application Studio project locally and in production environments. It is designed to streamline development, testing, and deployment workflows.

You can view and manage your project in Application Studio:https://app.studio/apps/drive/11eV7iS3EeMZvHoonuS3Z7YUWGQC8vsex

Setup

Prerequisites

Node.js (latest LTS version recommended)

npm (comes bundled with Node.js)

Installation

Clone the repository and install dependencies:

npm install

Configuration

Before running the application, configure the environment variables:

Create a .env.local file in the project root (if not already present).

Add your Gemini service key:

GEMINI_API_KEY=your_service_key_here

Deployment

Run Locally

Start the development server:

npm run dev

The application will be available at http://localhost:3000 (default port).

Production Deployment

Build for Production

Generate an optimized production build:

npm run build

Start Production Server

Run the production server:

npm run start

Environment Variables

For production environments, ensure the following variables are set:

GEMINI_API_KEY – valid Gemini service key

NODE_ENV=production – ensures optimized performance

Hosting Options

You can deploy the application to any modern hosting platform. Common options include:

Platform

Deployment Method

Notes

Vercel

Direct GitHub integration

Automatic builds and previews

AWS (Elastic Beanstalk / ECS)

Containerized deployment

Scalable infrastructure

Azure App Service

Node.js runtime support

Enterprise-grade integration

Netlify

Git-based deployment

Fast global CDN

Docker

Containerized image

Portable across environments

Notes

Ensure your Gemini service key is valid and active.

For production deployment, configure logging, monitoring, and scaling policies as required.

Security best practices: never commit .env.local or sensitive keys to version control.

This version now includes enterprise-ready deployment instructions with build steps, environment variables, and hosting options.

