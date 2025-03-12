# n8n-node-baserow-extended-auth

This custom n8n node provides enhanced functionality for interacting with the Baserow API, with extended authentication options for both cloud and self-hosted Baserow instances.

## Features

- **Extended Authentication Options**:
  - Username/Password authentication for Baserow Cloud
  - API Token authentication for self-hosted Baserow instances
  - Custom Host URL configuration for connecting to any Baserow instance

- **Complete Row Operations**:
  - Create: Add new rows to tables with field mapping
  - Read: Get individual rows by ID
  - Update: Modify existing rows with field mapping
  - Delete: Remove rows from tables
  - List: Get multiple rows with advanced filtering, sorting, and pagination

- **Advanced Data Handling**:
  - Auto-mapping of input data to Baserow fields
  - Field name to ID conversion for easier data manipulation
  - Support for complex filtering with multiple conditions
  - Sorting options for result ordering

- **Database and Table Management**:
  - Dynamic loading of databases, tables, and fields
  - User-friendly dropdown selectors for database and table selection

## Installation

### Local Installation (for development)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/n8n-node-baserow-extended-auth.git
   ```

2. Navigate to the project directory:
   ```bash
   cd n8n-node-baserow-extended-auth
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Build the project:
   ```bash
   pnpm build
   ```

5. Link to your n8n installation:
   ```bash
   pnpm link
   cd ~/.n8n/custom
   pnpm link n8n-node-baserow-extended-auth
   ```

### Production Installation

1. Install via npm:
   ```bash
   npm install n8n-node-baserow-extended-auth
   ```

2. Add to your n8n installation:
   - For Docker: Add to your custom nodes directory
   - For standard installation: Install in the `.n8n/custom` directory

## Authentication

### Baserow Cloud Authentication

1. In n8n, create a new credential of type "Baserow Extended Auth API"
2. Select "Username/Password (Cloud)" as the Authentication Type
3. Enter your Baserow username and password
4. Use the default host URL (`https://api.baserow.io`) or specify a custom one if needed

### Self-Hosted Baserow Authentication

1. In n8n, create a new credential of type "Baserow Extended Auth API"
2. Select "API Token (Self-Hosted)" as the Authentication Type
3. Generate an API token in your self-hosted Baserow instance:
   - Log in to your Baserow instance
   - Go to your account settings
   - Navigate to the API tokens section
   - Create a new token with appropriate permissions
4. Enter the API token in the credential
5. Specify the host URL of your self-hosted Baserow instance (e.g., `https://baserow.yourdomain.com`)

## Usage

### Working with Rows

#### Create a Row

1. Add the "Baserow Extended Auth" node to your workflow
2. Select "Row" as the Resource
3. Choose "Create" as the Operation
4. Select your Database and Table
5. Choose how to send data:
   - "Auto-Map Input Data": Maps incoming data to Baserow fields automatically
   - "Define Below": Manually specify field values

#### Get a Row

1. Add the "Baserow Extended Auth" node to your workflow
2. Select "Row" as the Resource
3. Choose "Get" as the Operation
4. Select your Database and Table
5. Enter the Row ID to retrieve

#### Get All Rows

1. Add the "Baserow Extended Auth" node to your workflow
2. Select "Row" as the Resource
3. Choose "Get All" as the Operation
4. Select your Database and Table
5. Configure filtering, sorting, and pagination options as needed

#### Update a Row

1. Add the "Baserow Extended Auth" node to your workflow
2. Select "Row" as the Resource
3. Choose "Update" as the Operation
4. Select your Database and Table
5. Enter the Row ID to update
6. Choose how to send data:
   - "Auto-Map Input Data": Maps incoming data to Baserow fields automatically
   - "Define Below": Manually specify field values

#### Delete a Row

1. Add the "Baserow Extended Auth" node to your workflow
2. Select "Row" as the Resource
3. Choose "Delete" as the Operation
4. Select your Database and Table
5. Enter the Row ID to delete

## Advanced Options

### Filtering

When using the "Get All" operation, you can apply filters to narrow down the results:

1. In the "Options" section, expand "Filters"
2. Add one or more filter conditions by selecting:
   - Field: The field to filter on
   - Filter: The comparison operator (equals, contains, greater than, etc.)
   - Value: The value to compare against
3. Set the "Filter Type" to determine how multiple filters are combined:
   - AND: All conditions must be met
   - OR: Any condition can be met

### Sorting

To sort the results when using the "Get All" operation:

1. In the "Options" section, expand "Sorting"
2. Add one or more sort criteria by selecting:
   - Field: The field to sort by
   - Direction: Ascending or Descending

### Search

You can also perform a text search across all fields:

1. In the "Options" section, enter a "Search Term"
2. The node will return rows where any field contains the search term

## License

[MIT](LICENSE)
