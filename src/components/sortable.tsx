import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

type Props = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  id: string;
  as: React.ElementType;
  data?: Record<string, unknown>;
  children: (
    listeners: SyntheticListenerMap | undefined,
    attributes: DraggableAttributes,
    isDragging: boolean
  ) => React.ReactNode | null;
};

// As custom reusable component that returns a children function to access props from the useSortable hook
const Sortable = ({ id, children, data, as: asProp, ...props }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition,
  } = useSortable({ id, data });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
      }
    : undefined;

  const Component = asProp || "div";

  return (
    <Component {...props} style={style} ref={setNodeRef}>
      {children(listeners, attributes, isDragging)}
    </Component>
  );
};

export default Sortable;
