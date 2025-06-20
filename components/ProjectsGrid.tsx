import type { ProjectRecord } from '@/lib/airtable';
import { Badge } from 'lucide-react';

export default function ProjectsGrid({ 
  projects, 
  opById 
}: { 
  projects: ProjectRecord[]; 
  opById: Record<string, string>; 
}) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-warm-gray">No projects available</p>
      </div>
    );
  }

  const getPillarColor = (pillar: string) => {
    switch (pillar.toLowerCase()) {
      case 'operations':
        return 'bg-sage/10 text-sage border-sage/20';
      case 'advisory':
        return 'bg-terra/10 text-terra border-terra/20';
      case 'incubation':
        return 'bg-coral/10 text-coral border-coral/20';
      default:
        return 'bg-stone/10 text-warm-gray border-stone/20';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div key={project.id} className="card group hover:scale-105 transition-transform duration-300">
          <div className="p-6">
            {/* Company and Pillar */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg">{project.company}</h3>
              <span className={`text-xs px-2 py-1 rounded-full border ${getPillarColor(project.pillar)}`}>
                {project.pillar}
              </span>
            </div>

            {/* Headline */}
            <p className="text-warm-gray mb-4 line-clamp-3">
              {project.headline}
            </p>

            {/* Operators */}
            {project.operators && project.operators.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-charcoal mb-2">Operators Involved:</p>
                <div className="flex flex-wrap gap-1">
                  {project.operators.map((operatorId) => {
                    const operatorName = opById[operatorId];
                    return operatorName ? (
                      <span 
                        key={operatorId} 
                        className="bg-stone/20 text-xs px-2 py-1 rounded-full text-warm-gray"
                      >
                        {operatorName}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* View Details Link */}
            <div className="mt-4 pt-4 border-t border-stone/20">
              <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors">
                View Details →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 