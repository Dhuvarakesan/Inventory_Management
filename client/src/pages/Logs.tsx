import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { logger, LogEntry, LogLevel } from '@/lib/logger';
import { Trash2, Search, Download, RefreshCw } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filters, setFilters] = useState({
    level: 'all' as LogLevel | 'all',
    search: '',
    userId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const loadLogs = () => {
    const currentLogs = logger.getLogs();
    setLogs(currentLogs);
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Filter by level
    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.level === filters.level);
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm) ||
        log.userEmail?.toLowerCase().includes(searchTerm) ||
        JSON.stringify(log.context || {}).toLowerCase().includes(searchTerm)
      );
    }

    // Filter by user ID
    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    setFilteredLogs(filtered);
  };

  const clearAllLogs = () => {
    logger.clearLogs();
    loadLogs();
    toast({
      title: "Logs cleared",
      description: "All logs have been cleared successfully.",
    });
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Logs exported",
      description: "Logs have been exported successfully.",
    });
  };

  const getLevelBadgeVariant = (level: LogLevel) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'secondary';
      case 'info': return 'default';
      case 'debug': return 'outline';
      default: return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Logs</h1>
          <p className="text-muted-foreground">
            View and manage system logs and user activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" onClick={clearAllLogs}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full"
              />
            </div>
            <Select
              value={filters.level}
              onValueChange={(value) => setFilters(prev => ({ ...prev, level: value as LogLevel | 'all' }))}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Log Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Logs ({filteredLogs.length})</span>
            {logs.length !== filteredLogs.length && (
              <span className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {logs.length} logs
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No logs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log, index) => (
                  <div key={log.id}>
                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                      <Badge variant={getLevelBadgeVariant(log.level)} className="mt-1">
                        {log.level.toUpperCase()}
                      </Badge>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{log.message}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                        {log.userEmail && (
                          <p className="text-sm text-muted-foreground">
                            User: {log.userEmail}
                          </p>
                        )}
                        {log.context && Object.keys(log.context).length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Context:</p>
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.context, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < filteredLogs.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}