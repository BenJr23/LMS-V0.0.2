export async function fetchUserRole(email: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/fetch-role?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Failed to fetch role: ${response.status} ${response.statusText}`);
      }
      return null;
    }

    const data = await response.json();
    return data.role || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}