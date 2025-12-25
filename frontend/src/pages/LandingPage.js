import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";

// Logo component using the uploaded image
const Logo = ({ className = "h-8" }) => (
  <img 
    src="https://customer-assets.emergentagent.com/job_a3b49cbe-3a5b-4133-8118-237a4bc11a65/artifacts/xw0jvksu_rightname.ai%20logo%20%281%29.png" 
    alt="RIGHTNAME" 
    className={className}
  />
);

// Animated Hero Logo (larger version)
const HeroLogo = () => (
  <div className="relative">
    <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full scale-150" />
    <img 
      src="https://customer-assets.emergentagent.com/job_a3b49cbe-3a5b-4133-8118-237a4bc11a65/artifacts/xw0jvksu_rightname.ai%20logo%20%281%29.png" 
      alt="RIGHTNAME" 
      className="relative h-20 md:h-28 lg:h-32"
    />
  </div>
);

// Stats Component
const StatItem = ({ value, label }) => (
  <div className="text-center">
    <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
    <div className="text-xs md:text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

// Showcase Card
const ShowcaseCard = ({ title, score, verdict, delay = 0 }) => (
  <div 
    className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer min-w-[240px]"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-xs text-gray-500 mb-1">Brand Analysis</div>
    <div className="text-lg font-bold text-white mb-3">{title}</div>
    <div className="flex items-center justify-between">
      <div className="text-3xl font-black text-white">{score}</div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
        verdict === 'GO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
      }`}>
        {verdict}
      </div>
    </div>
  </div>
);

// Feature Card
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 transition-colors">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, openAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brand_names: '',
    industry: '',
    category: '',
    product_type: 'Digital',
    usp: '',
    brand_vibe: '',
    positioning: 'Premium',
    market_scope: 'Multi-Country',
    countries: 'USA, India, UK'
  });

  const industries = [
    "Technology & Software", "E-commerce & Retail", "Finance & Banking", "Healthcare & Pharma",
    "Food & Beverage", "Fashion & Apparel", "Beauty & Cosmetics", "Travel & Hospitality",
    "Real Estate & Property", "Education & EdTech", "Media & Entertainment", "Automotive",
    "Professional Services", "Sports & Fitness", "Home & Living", "Gaming", "Other"
  ];

  const productTypes = [
    { value: "Physical", label: "Physical Product" },
    { value: "Digital", label: "Digital Product/App" },
    { value: "Service", label: "Service" },
    { value: "Hybrid", label: "Hybrid" }
  ];

  const uspOptions = [
    { value: "Price", label: "Best value" },
    { value: "Quality", label: "Superior quality" },
    { value: "Speed", label: "Fastest" },
    { value: "Design", label: "Beautiful design" },
    { value: "Eco-Friendly", label: "Sustainable" },
    { value: "Innovation", label: "Innovative" }
  ];

  const brandVibes = [
    { value: "Professional", label: "Professional" },
    { value: "Playful", label: "Playful" },
    { value: "Luxurious", label: "Luxurious" },
    { value: "Minimalist", label: "Minimalist" },
    { value: "Bold", label: "Bold" },
    { value: "Innovative", label: "Innovative" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brand_names.trim()) {
      toast.error("Please enter at least one brand name");
      return;
    }
    setLoading(true);
    try {
      const brandNames = formData.brand_names.split(',').map(n => n.trim()).filter(n => n);
      const countries = formData.countries.split(',').map(c => c.trim()).filter(c => c);
      
      const payload = {
        brand_names: brandNames,
        industry: formData.industry || 'General',
        category: formData.category || 'General',
        product_type: formData.product_type,
        usp: formData.usp || '',
        brand_vibe: formData.brand_vibe || '',
        positioning: formData.positioning,
        market_scope: formData.market_scope,
        countries: countries.length > 0 ? countries : ['USA']
      };

      const result = await api.evaluate(payload);
      navigate('/dashboard', { state: { data: result, query: payload } });
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Purple glow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Logo className="h-6 md:h-8" />
          
          <div className="flex items-center gap-4">
            {authLoading ? (
              <div className="w-20 h-9 bg-gray-800 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 hidden sm:inline">{user.name?.split(' ')[0]}</span>
                <button 
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => openAuthModal()}
                className="text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 px-5 py-2.5 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-32">
          
          {/* Centered Hero */}
          <div className="flex flex-col items-center text-center">
            
            {/* Logo with glow */}
            <HeroLogo />
            
            {/* Headline */}
            <h1 className="mt-12 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-4xl">
              Validate Your Brand Name
              <br />
              <span className="text-purple-500">in Minutes</span>
            </h1>
            
            {/* Subtitle */}
            <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
              AI-powered consulting-grade analysis for trademark risk, 
              cultural resonance, and competitive positioning.
            </p>
            
            {/* CTA Button */}
            <button 
              onClick={() => setShowForm(true)}
              className="mt-10 group flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Start Free Analysis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Trust Badge */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-black flex items-center justify-center text-xs"
                  >
                    {['🚀', '💡', '⭐', '🎯'][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                Trusted by <span className="text-white font-medium">10,000+</span> founders
              </span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-24 flex items-center justify-center gap-12 md:gap-20">
            <StatItem value="50K+" label="Names Analyzed" />
            <div className="w-px h-10 bg-gray-800" />
            <StatItem value="30s" label="Avg Report Time" />
            <div className="w-px h-10 bg-gray-800" />
            <StatItem value="180+" label="Countries" />
            <div className="w-px h-10 bg-gray-800 hidden md:block" />
            <div className="hidden md:block">
              <StatItem value="98%" label="Accuracy" />
            </div>
          </div>
          
          {/* Showcase Cards */}
          <div className="mt-24 flex items-center justify-center gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
            <ShowcaseCard title="LUXEVA" score="89" verdict="GO" delay={0} />
            <ShowcaseCard title="NOVAGLOW" score="83" verdict="GO" delay={100} />
            <ShowcaseCard title="ZENITH" score="76" verdict="CONDITIONAL" delay={200} />
          </div>
        </div>

        {/* Features Section */}
        <section className="py-24 border-t border-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">What You Get</h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                Everything you need to validate your brand name before launch
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard 
                icon="⚖️" 
                title="Legal Risk Matrix" 
                description="Trademark conflicts, genericness analysis, and rebranding probability assessment"
              />
              <FeatureCard 
                icon="🌍" 
                title="Global Culture Fit" 
                description="Linguistic and cultural resonance analysis across 180+ countries"
              />
              <FeatureCard 
                icon="📊" 
                title="Market Positioning" 
                description="Competitor analysis with strategic positioning matrices by country"
              />
              <FeatureCard 
                icon="🔍" 
                title="Domain & Social" 
                description="Real-time availability check for domains and social media handles"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-gray-900">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Logo className="h-12 mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to validate your brand?
            </h2>
            <p className="mt-4 text-gray-400">
              Get your comprehensive brand analysis report in under a minute
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-8 group flex items-center gap-2 bg-white text-black font-medium px-8 py-4 rounded-xl mx-auto transition-all duration-200 hover:scale-105"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Logo className="h-5" />
                <span className="text-sm text-gray-600">© 2025</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Analysis Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-gray-950 rounded-2xl border border-gray-800">
            {/* Header */}
            <div className="sticky top-0 bg-gray-950 border-b border-gray-800 px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Start Analysis</h3>
                <p className="text-sm text-gray-500 mt-0.5">Enter your brand details</p>
              </div>
              <button 
                onClick={() => setShowForm(false)}
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Brand Name */}
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Brand Name(s) *</Label>
                <Input 
                  name="brand_names"
                  value={formData.brand_names}
                  onChange={handleChange}
                  placeholder="e.g. LUMINA, ZENOVA"
                  className="h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg"
                  required
                />
                <p className="text-xs text-gray-600 mt-1.5">Separate multiple names with commas</p>
              </div>

              {/* Industry & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Industry</Label>
                  <Select onValueChange={(val) => handleSelectChange('industry', val)} value={formData.industry}>
                    <SelectTrigger className="h-12 bg-gray-900 border-gray-800 text-white rounded-lg">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind} className="text-gray-300 focus:bg-gray-800 focus:text-white">{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Category</Label>
                  <Input 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Skincare"
                    className="h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 rounded-lg"
                  />
                </div>
              </div>

              {/* Product Type & Positioning */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Product Type</Label>
                  <Select onValueChange={(val) => handleSelectChange('product_type', val)} value={formData.product_type}>
                    <SelectTrigger className="h-12 bg-gray-900 border-gray-800 text-white rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      {productTypes.map((pt) => (
                        <SelectItem key={pt.value} value={pt.value} className="text-gray-300 focus:bg-gray-800 focus:text-white">{pt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Positioning</Label>
                  <Select onValueChange={(val) => handleSelectChange('positioning', val)} value={formData.positioning}>
                    <SelectTrigger className="h-12 bg-gray-900 border-gray-800 text-white rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="Budget" className="text-gray-300 focus:bg-gray-800 focus:text-white">Budget</SelectItem>
                      <SelectItem value="Mid-Range" className="text-gray-300 focus:bg-gray-800 focus:text-white">Mid-Range</SelectItem>
                      <SelectItem value="Premium" className="text-gray-300 focus:bg-gray-800 focus:text-white">Premium</SelectItem>
                      <SelectItem value="Luxury" className="text-gray-300 focus:bg-gray-800 focus:text-white">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* USP & Brand Vibe */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">USP</Label>
                  <Select onValueChange={(val) => handleSelectChange('usp', val)} value={formData.usp}>
                    <SelectTrigger className="h-12 bg-gray-900 border-gray-800 text-white rounded-lg">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      {uspOptions.map((usp) => (
                        <SelectItem key={usp.value} value={usp.value} className="text-gray-300 focus:bg-gray-800 focus:text-white">{usp.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Brand Vibe</Label>
                  <Select onValueChange={(val) => handleSelectChange('brand_vibe', val)} value={formData.brand_vibe}>
                    <SelectTrigger className="h-12 bg-gray-900 border-gray-800 text-white rounded-lg">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      {brandVibes.map((vibe) => (
                        <SelectItem key={vibe.value} value={vibe.value} className="text-gray-300 focus:bg-gray-800 focus:text-white">{vibe.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Market & Countries */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Market Scope</Label>
                  <Select onValueChange={(val) => handleSelectChange('market_scope', val)} value={formData.market_scope}>
                    <SelectTrigger className="h-12 bg-gray-900 border-gray-800 text-white rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="Single Country" className="text-gray-300 focus:bg-gray-800 focus:text-white">Single Country</SelectItem>
                      <SelectItem value="Multi-Country" className="text-gray-300 focus:bg-gray-800 focus:text-white">Multi-Country</SelectItem>
                      <SelectItem value="Global" className="text-gray-300 focus:bg-gray-800 focus:text-white">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Countries</Label>
                  <Input 
                    name="countries"
                    value={formData.countries}
                    onChange={handleChange}
                    placeholder="USA, India, UK"
                    className="h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 rounded-lg"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Generate Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <p className="text-center text-xs text-gray-600">
                Free analysis • No credit card required
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
