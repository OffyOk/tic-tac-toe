import { NextApiRequest, NextApiResponse } from 'next';

// Function to handle GET requests
export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const response = await fetch('http://localhost:8080/api/games');
    const data = await response.json();
    console.log("this is data", data)
    res.status(200).json(data);
}


// Function to handle POST requests
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("what is req", JSON.stringify(req.body))
    const response = await fetch('http://localhost:8080/api/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });
    console.log("what is body", req.body)
    const data = await response.json();
    res.status(201).json(data);
}

// // Default export to handle unsupported methods
// export default function DefaultHandle(req: NextApiRequest, res: NextApiResponse) {
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
// };
