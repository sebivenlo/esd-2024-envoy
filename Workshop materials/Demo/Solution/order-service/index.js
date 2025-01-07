(async () => {
  const express = require("express");
  const os = require('os');
  const Docker = require('dockerode');
  const axios = require("axios");
  const docker = new Docker();
  const consul = require('consul')({host: 'consul'});

  // Retrieve dynamic values
  const HOSTNAME = os.hostname(); // Hostname dynamically assigned by Docker
  
  const dockerContainer = await getContainerDataDynamically();
  
  const SERVICE_NAME = dockerContainer.serviceName;
  const IP_ADDRESS = dockerContainer.ipAddress;

  const ports = dockerContainer.portMappings;
  const INTERNAL_PORT = ports[0].internal;
  const EXTERNAL_PORT = ports[0].external;

  const app = express();

  app.get("/", (req, res) => {
    res.send(`I am ${SERVICE_NAME} on port ${EXTERNAL_PORT}`);
  });

  app.listen(INTERNAL_PORT, () => {
    console.log(`${SERVICE_NAME} is running on port ${EXTERNAL_PORT}`);

    try {
      console.log("Registering with Consul...");

      // Register service in Consul
      consul.agent.service.register({
          Name: "order-service",
          ID: HOSTNAME,
          Address: IP_ADDRESS,
          Port: parseInt(EXTERNAL_PORT),
          Check: {
            HTTP: `http://${IP_ADDRESS}:${INTERNAL_PORT}/health`,
            Interval: "10s",
            Timeout: "1s",
          },
      }, (err) => {
          if (err) {
              console.error(`Error registering ${SERVICE_NAME} with Consul:`, err);
              return;
          }
      }
    )
      console.log(`${SERVICE_NAME} registered with Consul`);
    } catch (err) {
      console.error(`Error registering ${SERVICE_NAME}:`, err);
    }
  });

  app.get("/health", (req, res) => {
    res.status(200).send(`${SERVICE_NAME} is healthy!`);
  });


  async function getContainerDataDynamically() {
    try {
        const container = docker.getContainer(HOSTNAME);
        const data = await container.inspect();

        const address = data.NetworkSettings.Networks;

        const firstNetwork = Object.values(address)[0];
        const ipAddress = firstNetwork.IPAddress;

        const serviceName = data.Name.replace('/', '').replace('envoy_demo-', '');
        console.log('Service name:', serviceName);
        console.log('Address:', ipAddress);

        const ports = data.NetworkSettings.Ports;

        const portMappings = Object.entries(ports)
            .filter(([key, value]) => value) // Ensure there is a mapping
            .map(([key, value]) => ({
                internal: key.split('/')[0], // Extract the internal port
                external: value[0].HostPort  // Extract the external port
            }));

        if (portMappings.length === 0) {
            throw new Error('No ports found for the container');
        }

        console.log('Port mappings:', portMappings);

        return {portMappings, serviceName, ipAddress};
    } catch (error) {
        console.error('Error fetching ports:', error.message);
        throw error;
    }
  }
})();