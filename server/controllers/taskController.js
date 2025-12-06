import Task from "../modal/Task.js";
import Project from "../modal/Project.js";

// Create a new task full task
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      priority,
      estimatedHours,
      dueDate,
      assignedTo,
      labels,
      subtasks,
      isPrivate,
    } = req.body;

    const userId = req.user.id; // From auth middleware

    // 1. Validate required fields
    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Title and projectId are required",
      });
    }

    // 2. Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only projectStartedBy or users in managingUserId can create tasks
    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some(
      (managerId) => managerId.toString() === userId.toString()
    );

    if (!isCreator && !isManager) {
      return res.status(403).json({
        success: false,
        message: "Only project creator or managers can create tasks",
      });
    }

    // 4. Validate assignee (if provided)
    if (assignedTo) {
      // Check if assignee is a team member (not suspended/removed)
      const isValidAssignee = project.teamMembers.some(
        (member) => member.toString() === assignedTo
      );

      if (!isValidAssignee) {
        return res.status(400).json({
          success: false,
          message: "Assignee must be an active team member of the project",
        });
      }
    }

    // 5. Validate due date
    let validatedDueDate = null;
    if (dueDate) {
      const due = new Date(dueDate);
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);

      if (due < projectStart) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be before project start date",
        });
      }

      if (due > projectEnd) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be after project end date",
        });
      }

      validatedDueDate = due;
    }

    // 6. Validate and prepare subtasks
    const validatedSubtasks = [];
    if (subtasks && Array.isArray(subtasks)) {
      for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];

        // Validate subtask title
        if (!subtask.title || subtask.title.trim() === "") {
          return res.status(400).json({
            success: false,
            message: `Subtask ${i + 1} must have a title`,
          });
        }

        // Validate subtask assignee (if provided)
        if (subtask.assignedTo) {
          const isSubtaskAssigneeValid = project.teamMembers.some(
            (member) => member.toString() === subtask.assignedTo
          );

          if (!isSubtaskAssigneeValid) {
            return res.status(400).json({
              success: false,
              message: `Assignee for subtask "${subtask.title}" must be a team member`,
            });
          }
        }

        // Prepare subtask object
        validatedSubtasks.push({
          title: subtask.title.trim(),
          description: subtask.description?.trim() || "",
          assignedTo: subtask.assignedTo || null,
          estimatedHours: subtask.estimatedHours || 0,
          status: "todo",
          order: i, // Maintain order from array
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // 7. Get next order number for the task
    const taskCount = await Task.countDocuments({ projectId });

    // 8. Create the task
    const taskData = {
      title: title.trim(),
      description: description?.trim() || "",
      projectId,
      priority: priority || "medium",
      estimatedHours: estimatedHours || 0,
      dueDate: validatedDueDate,
      assignedTo: assignedTo || null,
      labels: labels || [],
      subtasks: validatedSubtasks,
      isPrivate: isPrivate || false,
      createdBy: userId,
      status: "todo",
      order: taskCount,
    };

    const task = new Task(taskData);
    await task.save();

    // 9. Add task to project's tasks array
    project.tasks.push(task._id);
    await project.save();

    // 10. Return success response
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: {
          _id: task._id,
          title: task.title,
          description: task.description,
          projectId: task.projectId,
          priority: task.priority,
          estimatedHours: task.estimatedHours,
          dueDate: task.dueDate,
          assignedTo: task.assignedTo,
          status: task.status,
          completionPercentage: task.completionPercentage || 0,
          totalSubtasks: task.subtasks.length,
          subtasks: task.subtasks.map((st) => ({
            _id: st._id,
            title: st.title,
            assignedTo: st.assignedTo,
            estimatedHours: st.estimatedHours,
            status: st.status,
          })),
          labels: task.labels,
          isPrivate: task.isPrivate,
          createdBy: task.createdBy,
          createdAt: task.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error creating task",
    });
  }
};

// Create quick task
export const createQuickTask = async (req, res) => {
  try {
    const { title, projectId } = req.body;
    const userId = req.user.id;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Title and projectId are required",
      });
    }

    // Check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check user permissions
    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some(
      (managerId) => managerId.toString() === userId.toString()
    );

    if (!isCreator && !isManager) {
      return res.status(403).json({
        success: false,
        message: "Only project creator or managers can create tasks",
      });
    }

    // Get next order number
    const taskCount = await Task.countDocuments({ projectId });

    // Create minimal task
    const task = new Task({
      title: title.trim(),
      projectId,
      createdBy: userId,
      priority: "medium",
      status: "todo",
      order: taskCount,
    });

    await task.save();

    // Add to project
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: {
          _id: task._id,
          title: task.title,
          projectId: task.projectId,
          status: task.status,
          createdBy: task.createdBy,
          createdAt: task.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error creating quick task:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating task",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


//get all the task for the user

export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get tasks where user is:
    // 1. Assigned to task
    // 2. Assigned to any subtask
    // 3. Created the task
    // 4. Is manager/creator of project
    const tasks = await Task.find({
      $or: [
        { assignedTo: userId },
        { "subtasks.assignedTo": userId },
        { createdBy: userId }
      ]
    })
    .populate('projectId', 'name')
    .populate('assignedTo', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};