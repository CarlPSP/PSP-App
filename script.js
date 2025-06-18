
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.error("Supabase library did not load.");
    return;
  }

  const supabaseUrl = 'https://ahawltslzuhdkahfnjut.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYXdsdHNsenVoZGthaGZuanV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjczMDIsImV4cCI6MjA2NTgwMzMwMn0.CTrI98wfwwY9bGILRJVofdr9MYS3nAdJSrjZNYTXjeA';
  const client = supabase.createClient(supabaseUrl, supabaseKey);

  async function fetchLeads() {
    const { data, error } = await client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    const container = document.getElementById('leadsContainer');
    container.innerHTML = '';

    if (error) {
      container.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = `<p class="text-gray-600">No leads found.</p>`;
      return;
    }

    data.forEach(lead => {
      const div = document.createElement('div');
      div.className = "p-4 bg-white rounded shadow";

      const statusOptions = ['New', 'Contacted', 'Scheduled', 'Closed', 'Lost'];
      const statusSelect = `<select onchange="updateStatus('${lead.id}', this.value)" class="border p-1 rounded">
        ${statusOptions.map(option => `<option value="${option}" ${option === lead.status ? 'selected' : ''}>${option}</option>`).join('')}
      </select>`;

      div.innerHTML = `
        <strong>${lead.name}</strong> (${lead.city})<br>
        ${statusSelect} - ${lead.source}<br>
        Revenue: $${lead.revenue ?? 0}<br>
        <small>${lead.created_at}</small>
        <br><textarea onchange="updateNotes('${lead.id}', this.value)" class="border rounded p-1 w-full mt-2">${lead.notes ?? ''}</textarea>
      `;

      container.appendChild(div);
    });
  }

  async function updateNotes(id, note) {
    await client.from('leads').update({ notes: note }).eq('id', id);
  }

  async function updateStatus(id, newStatus) {
    await client.from('leads').update({ status: newStatus }).eq('id', id);
  }

  fetchLeads();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('Service Worker registration failed:', err));
  }
});
