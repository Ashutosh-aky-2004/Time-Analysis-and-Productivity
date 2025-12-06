// Add comment to a subtask
export const addComment = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const userId = req.user._id;
    const { text, mentions } = req.body;

    // 1. Validate input
    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    // 2. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 3. Find the subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    // 4. Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 5. Check if user is project team member
    const isTeamMember = project.teamMembers.some(
      (member) => member.toString() === userId.toString()
    );
    const isManager = project.managingUserId.some((manager) =>
      manager._id
        ? manager._id.toString() === userId.toString()
        : manager.toString() === userId.toString()
    );
    const isCreator = project.projectStartedBy.toString() === userId.toString();

    if (!isTeamMember && !isManager && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "Only project team members can add comments",
      });
    }

    // 6. Validate mentions (if provided)
    const validMentions = [];
    if (mentions && Array.isArray(mentions)) {
      for (const mentionedUserId of mentions) {
        const isValidMention = project.teamMembers.some(
          (member) => member.toString() === mentionedUserId
        );

        if (isValidMention) {
          validMentions.push(mentionedUserId);
        }
        // Silently ignore invalid mentions (don't fail the request)
      }
    }

    // 7. Create comment object
    const newComment = {
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
      replies: [],
      reactions: [],
      mentions: validMentions,
      isPinned: false,
    };

    // 8. Add comment to subtask
    if (!subtask.comments) {
      subtask.comments = [];
    }
    subtask.comments.push(newComment);

    // 9. Update subtask updatedAt
    subtask.updatedAt = new Date();

    // 10. Save the task
    await task.save();

    // 11. Get the created comment (last in array)
    const createdComment = subtask.comments[subtask.comments.length - 1];

    // 12. Return success response
    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comment: {
          _id: createdComment._id,
          user: userId,
          text: createdComment.text,
          mentions: createdComment.mentions,
          createdAt: createdComment.createdAt,
          replyCount: 0,
          reactionCount: 0,
        },
        subtask: {
          _id: subtask._id,
          title: subtask.title,
          totalComments: subtask.comments.length,
        },
        task: {
          _id: task._id,
          title: task.title,
        },
        notification:
          validMentions.length > 0
            ? `Comment posted. ${validMentions.length} user(s) mentioned.`
            : "Comment posted successfully.",
      },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding comment",
    });
  }
};


// Add reply to a comment
export const addReply = async (req, res) => {
  try {
    const { taskId, subtaskId, commentId } = req.params;
    const userId = req.user._id;
    const { text, mentions } = req.body;

    // 1. Validate input
    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Reply text is required"
      });
    }

    // 2. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // 3. Find the subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found"
      });
    }

    // 4. Find the comment
    const comment = subtask.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    // 5. Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // 6. Check if user is project team member
    const isTeamMember = project.teamMembers.some(member =>
      member.toString() === userId.toString()
    );
    const isManager = project.managingUserId.some(manager =>
      manager._id ? manager._id.toString() === userId.toString() : manager.toString() === userId.toString()
    );
    const isCreator = project.projectStartedBy.toString() === userId.toString();

    if (!isTeamMember && !isManager && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "Only project team members can reply to comments"
      });
    }

    // 7. Validate mentions (if provided)
    const validMentions = [];
    if (mentions && Array.isArray(mentions)) {
      for (const mentionedUserId of mentions) {
        const isValidMention = project.teamMembers.some(member =>
          member.toString() === mentionedUserId
        );
        
        if (isValidMention) {
          validMentions.push(mentionedUserId);
        }
      }
    }

    // 8. Create reply object
    const newReply = {
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
      reactions: [],
      mentions: validMentions,
      parentCommentId: commentId
    };

    // 9. Add reply to comment
    if (!comment.replies) {
      comment.replies = [];
    }
    comment.replies.push(newReply);

    // 10. Update subtask updatedAt
    subtask.updatedAt = new Date();

    // 11. Save the task
    await task.save();

    // 12. Get the created reply (last in array)
    const createdReply = comment.replies[comment.replies.length - 1];

    // 13. Return success response
    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      data: {
        reply: {
          _id: createdReply._id,
          user: userId,
          text: createdReply.text,
          mentions: createdReply.mentions,
          createdAt: createdReply.createdAt,
          parentCommentId: createdReply.parentCommentId,
          reactionCount: 0
        },
        comment: {
          _id: comment._id,
          text: comment.text,
          replyCount: comment.replies.length
        },
        subtask: {
          _id: subtask._id,
          title: subtask.title
        },
        notification: validMentions.length > 0 
          ? `Reply posted. ${validMentions.length} user(s) mentioned.` 
          : "Reply posted successfully."
      }
    });

  } catch (error) {
    console.error("Error adding reply:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error adding reply",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};