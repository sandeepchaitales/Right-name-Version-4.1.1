from googlesearch import search

print("Testing googlesearch...")
try:
    results = list(search("Apple", num_results=5, advanced=True))
    if results:
        print(f"Found {len(results)} advanced results")
        for r in results:
            print(r.title, r.url)
    else:
        print("No advanced results. Trying basic...")
        results = list(search("Apple", num_results=5))
        print(f"Found {len(results)} basic results")
        for r in results:
            print(r)
except Exception as e:
    print(f"Error: {e}")
