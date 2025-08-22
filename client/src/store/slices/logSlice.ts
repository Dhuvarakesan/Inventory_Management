import { LogEntry, LogLevel } from '@/lib/logger';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LogState {
  logs: LogEntry[];
  filters: {
    level: LogLevel | 'all';
    userId: string | null;
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
}

const initialState: LogState = {
  logs: [],
  filters: {
    level: 'all',
    userId: null,
    dateRange: {
      start: null,
      end: null,
    },
  },
};

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<LogEntry>) => {
      state.logs.unshift(action.payload);
      // Keep only last 1000 logs
      if (state.logs.length > 1000) {
        state.logs = state.logs.slice(0, 1000);
      }
    },
    setLogs: (state, action: PayloadAction<LogEntry[]>) => {
      state.logs = action.payload;
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    setFilters: (state, action: PayloadAction<Partial<LogState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { addLog, setLogs, clearLogs, setFilters } = logSlice.actions;
export default logSlice.reducer;

// Example API call using the custom Axios instance
// const fetchLogs = async () => {
//   const response = await axiosInstance.get('/logs');
//   // handle response
// };
