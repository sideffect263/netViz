# NetScan360

NetScan360 is a web application that provides comprehensive network topology analysis, security assessments, and technology stack detection for any website. It helps users understand the network dependencies, security certificates, and technology stack of a website without requiring browser extensions.

## Features

- DNS and IP Lookup
- Network Request Mapping
- Traceroute & CDN Detection
- Security Analysis (TLS/SSL certificates, HTTP security headers)
- Technology Detection (backend technologies, JavaScript libraries, CMS platforms)

## Installation

To install and run the NetScan360 client locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/netscan360-client.git
   cd netscan360-client
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**

   ```sh
   npm start
   ```

   This will start the Vite development server on `http://localhost:3000`.

4. **Build for production:**

   ```sh
   npm run build
   ```

   This will create a production build in the `dist` directory.

5. **Preview the production build:**

   ```sh
   npm run preview
   ```

   This will start a local server to preview the production build.

## General Idea

NetScan360 aims to make web infrastructure analysis accessible to everyone by providing a user-friendly interface for analyzing various aspects of a website's network topology. The application performs DNS lookups, network request mapping, traceroute, CDN detection, and security analysis to provide valuable insights into a website's infrastructure. It also detects the technology stack used by the website, including backend technologies, JavaScript libraries, and CMS platforms.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For any questions or inquiries, please contact [your-email@example.com](mailto:your-email@example.com).
