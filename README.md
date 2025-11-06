# BiryaniKing52 Quotation Dashboard

A comprehensive catering quotation management system for BiryaniKing52. This application allows you to manage food items, categories, vendors, and generate detailed quotations with GST, discounts, and miscellaneous expenses.

## Features

- **Quote Management**: Create, edit, and manage quotations for catering events
- **Food Items Management**: Organize menu items with categories, vendors, and pricing
- **Category Management**: Organize food items into 13 distinct categories
- **Vendor Management**: Track multiple vendors with their pricing
- **Advanced Quotation Features**:
  - GST calculation (default 5%, configurable)
  - Discount percentage
  - Miscellaneous expenses (Transport, Waiters, Tables, Kitchen Staff, Kamlaka, Ice, Gas, Crockery/Cutlery) with quantity and price
- **Quote Status Workflow**: Draft → Pending → Approved/Rejected → In Progress → Completed
- **Edit Non-Approved Quotes**: Modify draft, pending, or rejected quotes
- **Print-Ready Quotations**: Generate professional quotes for clients

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Catering
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The build output will be in the `build` directory.

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Vite and configure the build settings
4. Deploy!

The application will be available at your Vercel URL.

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── QuoteGenerator.tsx  # Quote creation/editing
│   ├── QuotesList.tsx  # Quote management
│   └── ...
├── lib/
│   ├── store.ts        # Data store (in-memory, replace with Supabase in production)
│   ├── types.ts        # TypeScript type definitions
│   └── foodItemsData.ts # Food items initialization
└── main.tsx           # Application entry point
```

## Future Enhancements

- Replace in-memory store with Supabase database
- Add user authentication
- Implement persistent data storage
- Add PDF export functionality
- Email quotation feature

## License

Private project for BiryaniKing52
