export default (req, reply) => {
    reply.code(404).send({
        success: false,
        message: "Not Found",
        path: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
};
