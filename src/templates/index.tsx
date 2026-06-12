import type { VisualDoc, VisualType } from '../core/schema';
import type { Theme } from '../core/themes';
import ListTemplate from './ListTemplate';
import FlowTemplate from './FlowTemplate';
import CycleTemplate from './CycleTemplate';
import PyramidTemplate from './PyramidTemplate';
import ComparisonTemplate from './ComparisonTemplate';
import TimelineTemplate from './TimelineTemplate';
import FunnelTemplate from './FunnelTemplate';
import MatrixTemplate from './MatrixTemplate';
import MindmapTemplate from './MindmapTemplate';
import TargetTemplate from './TargetTemplate';
import StepsTemplate from './StepsTemplate';
import FishboneTemplate from './FishboneTemplate';

const REGISTRY: Record<VisualType, React.ComponentType<import('./common').TemplateProps>> = {
  list: ListTemplate,
  flow: FlowTemplate,
  cycle: CycleTemplate,
  pyramid: PyramidTemplate,
  comparison: ComparisonTemplate,
  timeline: TimelineTemplate,
  funnel: FunnelTemplate,
  matrix: MatrixTemplate,
  mindmap: MindmapTemplate,
  target: TargetTemplate,
  steps: StepsTemplate,
  fishbone: FishboneTemplate,
};

export function Infographic({
  doc,
  theme,
  rough,
  typeOverride,
  width = 960,
}: {
  doc: VisualDoc;
  theme: Theme;
  rough: boolean;
  typeOverride?: VisualType | 'auto';
  width?: number;
}) {
  const type = typeOverride && typeOverride !== 'auto' ? typeOverride : doc.type;
  const Template = REGISTRY[type] ?? ListTemplate;
  // השוואה דורשת side לכל פריט — אם המשתמש כפה comparison על דוק אחר, נחלק לסירוגין
  const effectiveDoc: VisualDoc =
    type === 'comparison' && !doc.items.some((it) => it.side)
      ? {
          ...doc,
          items: doc.items.map((it, i) => ({ ...it, side: i % 2 === 0 ? ('a' as const) : ('b' as const) })),
          sideLabels: doc.sideLabels ?? ['צד ראשון', 'צד שני'],
        }
      : doc;
  return <Template doc={effectiveDoc} theme={theme} rough={rough} width={width} />;
}
