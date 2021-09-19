module.exports = {
    run(interaction) {
        const { options } = interaction
        const sub = options.getSubcommand()
        ;({
            relay: require('./relay'),
            log: require('./log'),
        }[sub].run(interaction))
    },
}
