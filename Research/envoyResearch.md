# Envoy Research

## Research Questions
In this section, important research questions will be asked and answered. This will help with a deeper understanding of how computer networking works from the eyes of a software engineer and, in turn, help with the understanding of what Envoy is and how it works.

- What is microservice architecture?
- How does an API request usually work?
- What was the OSI model, and is it relevant here?
- What are ports, and how do they work?
- What is a proxy?
- What is the difference between a proxy and a reverse-proxy?
- What is network balancing, and when and how is it used?

## 1. Microservices & Networking
- What are the advantages and challenges of microservice architectures?
- How do microservices communicate with each other (e.g., HTTP, gRPC, TCP)?
- What are the common patterns for service discovery in microservice architectures?
- How does service-to-service authentication work in microservices?

## 2. Proxies & Load Balancing
- What are the key functions of a Layer 7 proxy?
- How does Envoy perform load balancing (strategies like round-robin, least-request, etc.)?
- How does Envoy compare to other popular proxies (like HAProxy, NGINX)?

## 3. Envoy-Specific Concepts
- What is Envoy, and what problems does it solve in a microservice architecture?
- How does Envoy manage traffic routing between services?
- How does Envoy handle resilience features such as circuit breaking and retry policies?
- How does Envoy handle observability (metrics, logging, and tracing)?
- What is Envoy’s role in a service mesh (e.g., with Istio)?
- How does Envoy support communication protocols (HTTP/1.x, HTTP/2, gRPC)?

## 4. Security
- What are the security implications of using a reverse proxy?
- How does Envoy handle TLS termination and mutual TLS (mTLS)?
- How can Envoy enforce authentication and authorization policies?

## 5. Configuration & Deployment
- How is Envoy typically deployed (sidecar pattern, standalone)?
- What is the structure of Envoy’s configuration file?
- How does dynamic configuration and control plane interaction work in Envoy (e.g., xDS APIs)?
- How does Envoy integrate with orchestration systems like Kubernetes?

## 6. Performance and Optimization
- What are the performance considerations when using Envoy in a high-traffic environment?
- How does Envoy’s performance compare to other reverse proxies in terms of latency and throughput?
