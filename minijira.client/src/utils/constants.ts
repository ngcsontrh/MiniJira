import React from 'react';
import { 
  BugOutlined, 
  CheckCircleOutlined, 
  BookOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

// Functions to create icons
const createBugIcon = () => React.createElement(BugOutlined, { style: { color: '#E83A3A' } });
const createTaskIcon = () => React.createElement(CheckCircleOutlined, { style: { color: '#4DABF7' } });
const createStoryIcon = () => React.createElement(BookOutlined, { style: { color: '#37B24D' } });
const createEpicIcon = () => React.createElement(ThunderboltOutlined, { style: { color: '#9775FA' } });
const createHighestPriorityIcon = () => React.createElement(ArrowUpOutlined, { style: { color: '#CD1317' } });
const createHighPriorityIcon = () => React.createElement(ArrowUpOutlined, { style: { color: '#E9494A' } });
const createMediumPriorityIcon = () => React.createElement(ArrowUpOutlined, { style: { color: '#E97F33' } });
const createLowPriorityIcon = () => React.createElement(ArrowDownOutlined, { style: { color: '#2D8738' } });
const createLowestPriorityIcon = () => React.createElement(ArrowDownOutlined, { style: { color: '#57A55A' } });

export const ISSUE_TYPES = [
  {
    id: 'bug',
    label: 'Bug',
    icon: createBugIcon
  },
  {
    id: 'task',
    label: 'Task',
    icon: createTaskIcon
  },
  {
    id: 'story',
    label: 'Story',
    icon: createStoryIcon
  },
  {
    id: 'epic',
    label: 'Epic',
    icon: createEpicIcon
  }
];

export const ISSUE_PRIORITIES = [
  {
    id: 'highest',
    label: 'Cao nhất',
    icon: createHighestPriorityIcon
  },
  {
    id: 'high',
    label: 'Cao',
    icon: createHighPriorityIcon
  },
  {
    id: 'medium',
    label: 'Trung bình',
    icon: createMediumPriorityIcon
  },
  {
    id: 'low',
    label: 'Thấp',
    icon: createLowPriorityIcon
  },
  {
    id: 'lowest',
    label: 'Thấp nhất',
    icon: createLowestPriorityIcon
  }
];