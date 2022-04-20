import type { SocketHandler } from "server";
import Joi from "joi";

export interface EmittedVote {
  optionId: string;
}

const voteSchema = Joi.object<EmittedVote>({
  optionId: Joi.string().required(),
});

/**
 * Handle real time voting updates
 *
 * @example
 * socket.on("option 123", (event) => {
 *    if (event === "vote") {
 *        // Handle the event
 *    }
 * })
 */
const onVote: SocketHandler = (socket, io) => {
  socket.on("vote", (data) => {
    const { error, value } = voteSchema.validate(data);
    if (error) return console.error(`Error validating vote from ${socket.id}`);
    io.emit(`option ${value.optionId}`, "vote");
  });
};

export default onVote;
