import { NextResponse } from 'next/server';
import { StaticApi } from '@/lib/staticApi';

export async function GET() {
  try {
    // Get all storytellers from the static API
    const result = await StaticApi.getStorytellers({
      page: 1,
      limit: 100 // Get all storytellers
    });

    if (!result || !result.data) {
      return NextResponse.json([], { status: 200 });
    }

    // Transform the data to match what the dashboard expects
    const transformedData = result.data.map((storyteller) => ({
      id: storyteller.id,
      name: storyteller.name,
      bio: storyteller.bio,
      data: {
        Name: storyteller.name,
        'Preferred Name': storyteller.metadata?.['Preferred Name'] || storyteller.name,
        Organisation: storyteller.organization || storyteller.metadata?.['Organisation'],
        Project: storyteller.project,
        Location: storyteller.location,
        Role: storyteller.role || storyteller.metadata?.['Role'],
        'Personal Quote': storyteller.metadata?.['Personal Quote'],
        'Empathy Ledger Reflection': storyteller.metadata?.['Empathy Ledger Reflection'],
        'File Profile Image': storyteller.metadata?.['File Profile Image'],
        'Website themes': storyteller.metadata?.['Website themes'] || [],
        ...storyteller.metadata
      }
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching storytellers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storytellers' },
      { status: 500 }
    );
  }
}