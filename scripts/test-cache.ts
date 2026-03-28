
const DEFAULT_URL = "http://localhost:3000/api/team-members?pageNumber=1&pageSize=4";
const API_URL = process.argv[2] || DEFAULT_URL;

async function measureRequest(label: string) {
    const start = performance.now();
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            cache: 'default', // Explicitly use default cache behavior
            headers: {
                'Accept': 'application/json'
            },
        });
        const end = performance.now();
        const cacheHeader = response.headers.get('x-vercel-cache') || 'N/A';
        const duration = (end - start).toFixed(2);
        
        console.log(`${label}:`);
        console.log(`  - Time: ${duration}ms`);
        console.log(`  - Cache Header: ${cacheHeader}`);
        console.log(`  - Status: ${response.status}`);
        return { duration: parseFloat(duration), cache: cacheHeader };
    } catch (error: any) {
        console.error(`${label} failed:`, error.message);
        return null;
    }
}

async function runTest() {
    console.log(`Testing API Cache for: ${API_URL}\n`);

    console.log("--- TEST 1: The Cold Start (Database Hit) ---");
    await measureRequest("Request #1");

    console.log("\nWaiting 2 seconds to ensure Vercel propagates...");
    await new Promise(r => setTimeout(r, 2000));

    console.log("\n--- TEST 2: The Hot Cache (Should be much faster) ---");
    const result2 = await measureRequest("Request #2");

    if (result2 && (result2.cache === 'HIT' || result2.duration < 100)) {
        console.log("\n✅ SUCCESS: The cache is working. Request #2 was served from the Edge.");
    } else {
        console.log("\n⚠️ NOTICE: Request #2 was still a MISS. Vercel might be populating the regional cache.");
    }

    console.log("\n--- INSTRUCTIONS FOR REVALIDATION TEST ---");
    console.log("1. Go to your CMS and ADD or UPDATE a Team Member.");
    console.log("2. Run this script again immediately.");
    console.log("3. You should see Request #1 become a 'MISS' (Fresh data fetched) even if it was a 'HIT' before.");
}

runTest();
