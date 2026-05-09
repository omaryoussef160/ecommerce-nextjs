import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const products = await Product.find({ seller: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Get seller products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
