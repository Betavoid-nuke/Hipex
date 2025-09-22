
import { marketplaceData } from '@/Website/data/marketplaceData';
import { useEffect } from 'react';

const MarketplacePage = () => {

    useEffect(() => {
        const renderMarketplaceListings = () => {
            const listingsContainer = document.getElementById('marketplace-listings');
            const totalResults = document.getElementById('total-results');
            if (!listingsContainer || !totalResults) return;
            listingsContainer.innerHTML = '';

            marketplaceData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'product-card';
                
                const getStars = (rating: number) => {
                    let stars = '';
                    for (let i = 0; i < Math.floor(rating); i++) {
                        stars += `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>`;
                    }
                    return stars;
                };

                card.style.background = "rgb(15, 22, 41)";
                card.style.border = "none";

                card.innerHTML = `
                    <div class="rounded-lg overflow-hidden relative mb-4">
                        <img src="${item.image}" alt="${item.title}" style="width:100%; height:12rem; object-fit:cover;" class="rounded-md">
                        <div class="absolute" style="top:0.5rem; left:0.5rem; padding:0.25rem 0.75rem; background-image:linear-gradient(to right, var(--color-accent-purple), var(--color-accent-blue)); border-radius:9999px; color:white; font-size:0.75rem; font-weight:600;">
                            ${item.tag}
                        </div>
                    </div>
                    <div class="text-left">
                        <h3 class="text-xl font-bold text-white" style="line-height:1.25;">${item.title}</h3>
                        <p class="text-sm text-gray-400 mt-1">${item.category} category</p>
                        <div class="flex items-center space-x-2 mt-4" style="color:var(--color-warning); font-size:0.875rem;">
                            <span>${item.rating}</span>
                            ${getStars(item.rating)}
                            <span class="text-gray-500">(${item.reviews})</span>
                        </div>
                        <div class="flex justify-between items-center mt-4">
                            <span class="text-2xl font-bold gradient-text">$${item.price}</span>
                            <button style="background-image:linear-gradient(to right, var(--color-accent-purple), var(--color-accent-blue))" class="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all">
                                Buy Now
                            </button>
                        </div>
                    </div>
                `;
                listingsContainer.appendChild(card);
            });
            totalResults.textContent = marketplaceData.length.toString();
        }
        renderMarketplaceListings();
    }, []);

    return (
        <section id="marketplace" className="pt-32 pb-24">
            <div className="container" style={{maxWidth: '80rem'}}>
                <div>
                    <div className="filter-sidebar" style={{
                        position: 'fixed',
                        width: '350px', 
                        height: '100vh', 
                        top: '0',
                        left: '0',
                        paddingTop: '8rem',
                        paddingBottom: '2rem',
                        marginLeft: '80px'
                    }}>
                        <div className="filter-card" style={{
                            height: '100%',
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            padding: '1.5rem',
                            backgroundColor: 'transparent',
                            border:'none'
                        }}>
                            <div className="space-y-6">
                                <details open>
                                    <summary className="text-xl font-semibold text-white cursor-pointer py-2 flex justify-between">
                                        Category
                                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </summary>
                                    <div className="pt-4 space-y-3 text-gray-400">
                                        <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded-lg"/><span>Urban</span></label>
                                        <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded-lg"/><span>Nature</span></label>
                                        <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded-lg"/><span>Sci-Fi</span></label>
                                        <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded-lg"/><span>Fantasy</span></label>
                                        <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded-lg"/><span>Abstract</span></label>
                                        <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded-lg"/><span>Cyberpunk</span></label>
                                    </div>
                                </details>
                                <div className="w-full h-px bg-gray-700"></div>
                                <details open>
                                    <summary className="text-xl font-semibold text-white cursor-pointer py-2 flex justify-between">
                                        Price
                                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </summary>
                                    <div className="pt-4 flex items-center space-x-4">
                                        <input type="number" placeholder="Min" className="w-1/2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"/>
                                        <span className="text-gray-500">-</span>
                                        <input type="number" placeholder="Max" className="w-1/2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"/>
                                    </div>
                                </details>
                                <div className="w-full h-px bg-gray-700"></div>
                                <details open>
                                    <summary className="text-xl font-semibold text-white cursor-pointer py-2 flex justify-between">
                                        Features
                                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </summary>
                                    <div className="pt-4 space-y-3 text-gray-400">
                                        <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded-lg"/><span>HDR Lighting</span></label>
                                        <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded-lg"/><span>Dynamic Weather</span></label>
                                        <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded-lg"/><span>Interactive Objects</span></label>
                                    </div>
                                </details>
                                <button className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">Apply Filters</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="listings-container" style={{
                        marginLeft: '370px',
                        marginTop: '-120px',
                    }}>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-sm text-gray-400">Showing 1-6 of <span id="total-results">38</span> results</p>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">Sort by:</span>
                                <select className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm appearance-none pr-8">
                                    <option>Popular</option>
                                    <option>Newest</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                        <div id="marketplace-listings" className="listings-grid">
                        </div>
                    </div>
                
                </div>
            </div>
        </section>
    );
};
export default MarketplacePage;