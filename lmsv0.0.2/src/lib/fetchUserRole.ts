export async function fetchUserRole(email: string): Promise<string | null> {
  try {
    const response = await fetch('/api/getUserRole?email=' + encodeURIComponent(email), {
      method: 'GET',
    });

    if (!response.ok) {
      console.error(`Fetch failed: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log('Fetched user role:', data);

    return data.Role?.[0] || null;

  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}
