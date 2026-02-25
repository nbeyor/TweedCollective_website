'use client'

export interface OrgNode {
  label: string
  children?: OrgNode[]
}

interface OrgTreeProps {
  root: OrgNode
  title?: string
}

function TreeNode({ node }: { node: OrgNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="px-4 py-2 bg-sage/20 border border-sage/30 rounded-lg text-sm text-cream/90 font-medium whitespace-nowrap">
        {node.label}
      </div>
      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-4 bg-cream/20" />
          <div className="flex items-start relative">
            {node.children.length > 1 && (
              <div
                className="absolute top-0 h-px bg-cream/20"
                style={{
                  left: `${100 / (2 * node.children.length)}%`,
                  right: `${100 / (2 * node.children.length)}%`,
                }}
              />
            )}
            {node.children.map((child, i) => (
              <div key={i} className="flex flex-col items-center px-3">
                <div className="w-px h-4 bg-cream/20" />
                <TreeNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function OrgTree({ root, title }: OrgTreeProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {title && <h4 className="text-sm font-medium text-cream/60">{title}</h4>}
      <TreeNode node={root} />
    </div>
  )
}
