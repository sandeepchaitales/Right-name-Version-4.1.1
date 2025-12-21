import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const BrandRadarChart = ({ data }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#0F172A"
            strokeWidth={2}
            fill="#0F172A"
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ScoreCard = ({ title, score, verdict, subtitle }) => {
    let colorClass = "text-slate-900";
    if (verdict === "GO") colorClass = "text-emerald-600";
    if (verdict === "CONDITIONAL GO") colorClass = "text-amber-600";
    if (verdict === "NO-GO" || verdict === "REJECT") colorClass = "text-red-600";

    return (
        <Card className="border-t-4 border-t-primary shadow-sm h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-serif font-bold text-primary">{score}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                </div>
                {verdict && (
                    <div className={`mt-2 font-bold ${colorClass}`}>
                        {verdict}
                    </div>
                )}
                {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
            </CardContent>
        </Card>
    );
};

export const CompetitionAnalysis = ({ data }) => {
    return (
        <Card className="border-slate-200 shadow-md overflow-hidden">
            <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="text-lg font-serif">Competitive Landscape Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                     <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Competitive White Space</h4>
                     <p className="text-slate-800 font-medium text-lg leading-relaxed">{data.white_space_analysis}</p>
                </div>

                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px] font-bold text-slate-900">Competitor</TableHead>
                                <TableHead className="font-bold text-slate-900">Positioning</TableHead>
                                <TableHead className="text-right font-bold text-slate-900">Price Range</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.competitors && data.competitors.map((comp, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{comp.name}</TableCell>
                                    <TableCell>{comp.positioning}</TableCell>
                                    <TableCell className="text-right font-mono text-slate-600">{comp.price_range}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-200">
                     <div className="p-6 border-r border-slate-200 bg-emerald-50/50">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Strategic Advantage</h4>
                        <p className="text-sm text-slate-700">{data.strategic_advantage}</p>
                     </div>
                     <div className="p-6 flex items-center justify-center bg-slate-50">
                        <div className="text-center">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Suggested Pricing</h4>
                            <span className="text-2xl font-serif font-bold text-slate-900">{data.suggested_pricing}</span>
                        </div>
                     </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const TrademarkRiskTable = ({ matrix }) => {
    if (!matrix) return null;

    const rows = [
        { label: "Genericness / Descriptiveness", ...matrix.genericness },
        { label: "Existing Conflicts", ...matrix.existing_conflicts },
        { label: "Phonetic Similarity", ...matrix.phonetic_similarity },
        { label: "Relevant Trademark Classes", ...matrix.relevant_classes },
        { label: "Rebranding Probability (3-5y)", ...matrix.rebranding_probability },
    ];

    const getZoneBadge = (zone) => {
        if (zone === "Green") return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">Green</Badge>;
        if (zone === "Yellow") return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Yellow</Badge>;
        if (zone === "Red") return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Red</Badge>;
        return zone;
    };

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                 <CardTitle className="text-lg font-serif text-slate-800">Trademark Risk Matrix</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50">
                            <TableHead className="w-[200px] font-bold text-slate-900">Risk Factor</TableHead>
                            <TableHead className="text-center font-bold text-slate-900 w-[100px]">Likelihood (1-10)</TableHead>
                            <TableHead className="text-center font-bold text-slate-900 w-[100px]">Severity (1-10)</TableHead>
                            <TableHead className="text-center font-bold text-slate-900 w-[100px]">Zone</TableHead>
                            <TableHead className="font-bold text-slate-900">Commentary & Mitigation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium text-slate-700">{row.label}</TableCell>
                                <TableCell className="text-center">{row.likelihood}</TableCell>
                                <TableCell className="text-center">{row.severity}</TableCell>
                                <TableCell className="text-center">{getZoneBadge(row.zone)}</TableCell>
                                <TableCell className="text-sm text-slate-600 leading-relaxed">{row.commentary}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Overall Legal Risk Assessment</h4>
                    <p className="text-sm text-slate-800 leading-relaxed">{matrix.overall_assessment}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export const DomainAvailabilityCard = ({ analysis }) => {
    if (!analysis) return null;

    return (
        <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                    Domain Availability
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="text-lg font-serif font-bold text-slate-900 mb-1">
                        {analysis.exact_match_status}
                    </div>
                    <p className="text-xs text-slate-500 italic">Analysis based on common keyword patterns</p>
                </div>
                
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Recommended Alternatives</h4>
                    <ul className="space-y-2">
                        {analysis.alternatives.map((alt, i) => (
                            <li key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-1 last:border-0">
                                <span className="font-mono text-slate-700">{alt.domain}</span>
                                <span className="text-xs text-slate-400">{alt.example}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                    <p className="text-xs text-blue-800 leading-relaxed">
                        <span className="font-bold">Strategy:</span> {analysis.strategy_note}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
