#!/bin/bash
# Script to execute all SQL batch files

echo "This script will execute all 7 SQL batches"
echo "Please execute each batch via Claude Code MCP manually"
echo ""

for i in {1..7}; do
  batch_file="sql_batches/batch_$(printf '%03d' $i).sql"
  echo "Batch $i: $batch_file"
done

echo ""
echo "To execute via Claude Code, use the mcp__supabase__execute_sql tool"
echo "and pass the content of each batch file"
