import Project from "../modal/Project.js";
import Task from "../modal/Task.js";

// Add comment to a subtask
export const addComment = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const userId = req.user.id;
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
    const userId = req.user.id;
    const { text, mentions } = req.body;

    // 1. Validate input
    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Reply text is required",
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

    // 4. Find the comment
    const comment = subtask.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // 5. Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 6. Check if user is project team member
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
        message: "Only project team members can reply to comments",
      });
    }

    // 7. Validate mentions (if provided)
    const validMentions = [];
    if (mentions && Array.isArray(mentions)) {
      for (const mentionedUserId of mentions) {
        const isValidMention = project.teamMembers.some(
          (member) => member.toString() === mentionedUserId
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
      parentCommentId: commentId,
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
          reactionCount: 0,
        },
        comment: {
          _id: comment._id,
          text: comment.text,
          replyCount: comment.replies.length,
        },
        subtask: {
          _id: subtask._id,
          title: subtask.title,
        },
        notification:
          validMentions.length > 0
            ? `Reply posted. ${validMentions.length} user(s) mentioned.`
            : "Reply posted successfully.",
      },
    });
  } catch (error) {
    console.error("Error adding reply:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error adding reply",
    });
  }
};

//Get all comments for a subtask (with replies and reactions)
export const getSubtaskComments = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const userId = req.user.id;

    // 1. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 2. Find the subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    // 3. Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 4. Check if user is project team member
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
        message: "Only project team members can view comments",
      });
    }

    // 5. Get comments with user info (simulated population)
    // In development: just return IDs
    // In production: you'd populate user data
    const comments = subtask.comments || [];

    // 6. Format comments for frontend modal
    const formattedComments = comments.map((comment) => {
      // Count reactions by type
      const reactionCounts = {};
      const userReactions = {};

      if (comment.reactions && comment.reactions.length > 0) {
        comment.reactions.forEach((reaction) => {
          // Count each reaction type
          reactionCounts[reaction.type] =
            (reactionCounts[reaction.type] || 0) + 1;

          // Check if current user has reacted
          if (reaction.user && reaction.user.toString() === userId.toString()) {
            userReactions[reaction.type] = true;
          }
        });
      }

      // Format replies
      const formattedReplies = (comment.replies || []).map((reply) => {
        const replyReactionCounts = {};
        const replyUserReactions = {};

        if (reply.reactions && reply.reactions.length > 0) {
          reply.reactions.forEach((reaction) => {
            replyReactionCounts[reaction.type] =
              (replyReactionCounts[reaction.type] || 0) + 1;

            if (
              reaction.user &&
              reaction.user.toString() === userId.toString()
            ) {
              replyUserReactions[reaction.type] = true;
            }
          });
        }

        return {
          _id: reply._id,
          userId: reply.user,
          text: reply.text,
          createdAt: reply.createdAt,
          isEdited: reply.isEdited || false,
          editedAt: reply.editedAt,
          mentions: reply.mentions || [],
          reactions: replyReactionCounts,
          userReactions: replyUserReactions,
          parentCommentId: reply.parentCommentId,
          user: { _id, firstName, lastName, avatar },
        };
      });

      return {
        _id: comment._id,
        userId: comment.user,
        text: comment.text,
        createdAt: comment.createdAt,
        isEdited: comment.isEdited || false,
        editedAt: comment.editedAt,
        mentions: comment.mentions || [],
        isPinned: comment.isPinned || false,
        reactions: reactionCounts,
        userReactions: userReactions,
        replies: formattedReplies,
        replyCount: formattedReplies.length,
        user: { _id, firstName, lastName, avatar },
      };
    });

    // 7. Get subtask assignee info
    const assigneeInfo = subtask.assignedTo
      ? {
          userId: subtask.assignedTo,
          // In production: populated user object
        }
      : null;

    // 8. Return comprehensive modal data
    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: {
        modal: {
          title: "Comments",
          subtitle: `Discussion for: ${subtask.title}`,
          totalComments: comments.length,
          totalReplies: comments.reduce(
            (total, comment) => total + (comment.replies?.length || 0),
            0
          ),
          pinnedComments: formattedComments.filter((c) => c.isPinned).length,
        },
        subtask: {
          _id: subtask._id,
          title: subtask.title,
          status: subtask.status,
          assignee: assigneeInfo,
          createdAt: subtask.createdAt,
          updatedAt: subtask.updatedAt,
        },
        task: {
          _id: task._id,
          title: task.title,
          projectId: task.projectId,
        },
        project: {
          _id: project._id,
          name: project.name,
          teamCount: project.teamMembers.length,
        },
        comments: formattedComments,
        // Available reaction types for UI
        reactionTypes: [
          { emoji: "👍", type: "like", label: "Like" },
          { emoji: "👎", type: "dislike", label: "Dislike" },
          { emoji: "❤️", type: "love", label: "Love" },
          { emoji: "😂", type: "laugh", label: "Laugh" },
          { emoji: "😲", type: "wow", label: "Wow" },
          { emoji: "😢", type: "sad", label: "Sad" },
          { emoji: "😠", type: "angry", label: "Angry" },
          { emoji: "✅", type: "check", label: "Check" },
          { emoji: "🔥", type: "fire", label: "Fire" },
        ],
        // Permissions for current user
        permissions: {
          canComment: true, // Already validated
          canPin: isManager || isCreator, // Only managers/creator can pin
          canDelete: isManager || isCreator, // Only managers/creator can delete
          canEditOwnComments: true, // Users can edit their own comments
          editWindow: 15, // Minutes to edit own comments
        },
        // Real-time features (if implemented)
        realTime: {
          enabled: false, // Set to true if using Socket.io
          channel: `comments-${subtaskId}`,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching comments",
    });
  }
};

// Add reaction to a comment
export const addCommentReaction = async (req, res) => {
  try {
    const { taskId, subtaskId, commentId } = req.params;
    const userId = req.user.id;
    const { type } = req.body;

    // 1. Validate reaction type
    const validReactionTypes = [
      "like",
      "dislike",
      "love",
      "laugh",
      "wow",
      "sad",
      "angry",
      "check",
      "fire",
    ];

    if (!type || !validReactionTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid reaction type. Must be one of: ${validReactionTypes.join(
          ", "
        )}`,
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

    // 4. Find the comment
    const comment = subtask.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // 5. Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 6. Check if user is project team member
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
        message: "Only project team members can react to comments",
      });
    }

    // 7. Initialize reactions array if doesn't exist
    if (!comment.reactions) {
      comment.reactions = [];
    }

    // 8. Check if user already reacted with this type
    const existingReaction = comment.reactions.find(
      (reaction) =>
        reaction.user.toString() === userId.toString() && reaction.type === type
    );

    if (existingReaction) {
      return res.status(400).json({
        success: false,
        message: `You already reacted with ${type} to this comment`,
      });
    }

    // 9. Create reaction object
    const newReaction = {
      user: userId,
      type: type,
      createdAt: new Date(),
    };

    // 10. Add reaction to comment
    comment.reactions.push(newReaction);

    // 11. Update subtask updatedAt
    subtask.updatedAt = new Date();

    // 12. Save the task
    await task.save();

    // 13. Count reactions by type
    const reactionCounts = {};
    comment.reactions.forEach((reaction) => {
      reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1;
    });

    // 14. Return success response
    res.status(201).json({
      success: true,
      message: "Reaction added successfully",
      data: {
        reaction: {
          type: type,
          user: userId,
          createdAt: newReaction.createdAt,
        },
        comment: {
          _id: comment._id,
          reactionCount: comment.reactions.length,
          reactionsByType: reactionCounts,
        },
        subtask: {
          _id: subtask._id,
          title: subtask.title,
          updatedAt: subtask.updatedAt,
        },
        analytics: {
          mostPopularReaction: Object.keys(reactionCounts).reduce((a, b) =>
            reactionCounts[a] > reactionCounts[b] ? a : b
          ),
          totalReactions: comment.reactions.length,
          userReaction: type,
        },
      },
    });
  } catch (error) {
    console.error("Error adding reaction to comment:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding reaction",
    });
  }
};

// Add reaction to a reply
export const addReplyReaction = async (req, res) => {
  try {
    const { taskId, subtaskId, commentId, replyId } = req.params;
    const userId = req.user.id;
    const { type } = req.body;

    // 1. Validate reaction type
    const validReactionTypes = [
      "like",
      "dislike",
      "love",
      "laugh",
      "wow",
      "sad",
      "angry",
      "check",
      "fire",
    ];

    if (!type || !validReactionTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid reaction type. Must be one of: ${validReactionTypes.join(
          ", "
        )}`,
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

    // 4. Find the comment
    const comment = subtask.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // 5. Find the reply
    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // 6. Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 7. Check if user is project team member
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
        message: "Only project team members can react to replies",
      });
    }

    // 8. Initialize reactions array if doesn't exist
    if (!reply.reactions) {
      reply.reactions = [];
    }

    // 9. Check if user already reacted with this type
    const existingReaction = reply.reactions.find(
      (reaction) =>
        reaction.user.toString() === userId.toString() && reaction.type === type
    );

    if (existingReaction) {
      return res.status(400).json({
        success: false,
        message: `You already reacted with ${type} to this reply`,
      });
    }

    // 10. Create reaction object
    const newReaction = {
      user: userId,
      type: type,
      createdAt: new Date(),
    };

    // 11. Add reaction to reply
    reply.reactions.push(newReaction);

    // 12. Update subtask updatedAt
    subtask.updatedAt = new Date();

    // 13. Save the task
    await task.save();

    // 14. Count reactions by type
    const reactionCounts = {};
    reply.reactions.forEach((reaction) => {
      reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1;
    });

    // 15. Return success response
    res.status(201).json({
      success: true,
      message: "Reaction added to reply successfully",
      data: {
        reaction: {
          type: type,
          user: userId,
          createdAt: newReaction.createdAt,
        },
        reply: {
          _id: reply._id,
          reactionCount: reply.reactions.length,
          reactionsByType: reactionCounts,
        },
        comment: {
          _id: comment._id,
          text:
            comment.text.substring(0, 50) +
            (comment.text.length > 50 ? "..." : ""),
        },
        analytics: {
          isSolution: type === "check",
          totalReactions: reply.reactions.length,
          userReaction: type,
        },
      },
    });
  } catch (error) {
    console.error("Error adding reaction to reply:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding reaction to reply",
    });
  }
};
