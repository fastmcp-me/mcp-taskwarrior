#!/usr/bin/env node
/**
 * This is a simple MCP server that facilitates management of tasks in Taskwarrior.
 * 
 * It provides 4 tools:
 * - add_task
 * - update_task
 * - delete_task
 * - list_tasks
 * 
 * The add_task tool allows you to add a new task to Taskwarrior.
 * The update_task tool allows you to update an existing task in Taskwarrior.
 * The delete_task tool allows you to delete a task from Taskwarrior.
 * The list_tasks tool allows you to list all tasks in Taskwarrior.
 */
import { FastMCP } from "fastmcp";
import { TaskwarriorLib } from "taskwarrior-lib";
import type { Task } from "taskwarrior-lib/types/index.d.ts";
import { z } from "zod";

const server = new FastMCP({
  name: "Taskwarrior",
  version: "1.0.0",
});

const taskwarrior = new TaskwarriorLib();

server.addTool({
  name: "add_task",
  description: "Add task to Taskwarrior",
  parameters: z.object({
    uuid: z.string().optional(),
    description: z.string(),
    priority: z.enum(["H", "M", "L"]).optional(),
    project: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    due: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  execute: async (args) => {
    console.log(`Adding task: ${args.description}`);
    const task: Task = {
        ...args
    }
    console.log(taskwarrior.update([task]));
    return "Task added successfully";
  },
});

server.addTool({
    name: "update_task",
    description: "Update task in Taskwarrior",
    parameters: z.object({
        uuid: z.string(),
        description: z.string(),
        priority: z.enum(["H", "M", "L"]).optional(),
        project: z.string().optional(),
        start: z.string().optional(),
        end: z.string().optional(),
        due: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }),
    execute: async (args) => {
        console.log(`Updating task: ${args.description}`);
        const task: Task = {
            ...args
        }
        console.log(taskwarrior.update([task]));
        return `Task ${task.id} updated successfully`;
    },
});

server.addTool({
    name: "list_tasks",
    description: "List tasks in Taskwarrior",
    parameters: z.object({
        project: z.string().optional(),
    }),
    execute: async (args) => {
        console.log(`Listing tasks in project: ${args.project || "all"}`);
        const tasks = taskwarrior.load(args.project || "");
        return JSON.stringify(tasks);
    },
});

server.addTool({
    name: "delete_task",
    description: "Delete task in Taskwarrior",
    parameters: z.object({
        uuid: z.string(),
    }),
    execute: async (args) => {
        console.log(`Deleting task: ${args.uuid}`);
        taskwarrior.del([{ uuid: args.uuid }]);
        return `Task ${args.uuid} deleted successfully`;
    },
});
  
server.start({
  transportType: "stdio",
});
