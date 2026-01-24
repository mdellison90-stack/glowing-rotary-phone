# GitHub Copilot Agents for Asymmetric Key Generator

This repository uses GitHub Copilot custom agents to help with development tasks. These agents are specialized assistants that understand the codebase and can help you make changes safely and efficiently.

## Available Agents

### @electron-app-assistant

**Purpose**: Specialized agent for developing and maintaining the Asymmetric Key Generator Electron application.

**What it helps with**:
- Code changes following Electron security best practices
- Implementing new features for key generation and management
- Debugging IPC communication issues
- Ensuring cryptographic operations are secure
- Maintaining code quality with ESLint standards
- Updating documentation

**When to use**:
- Adding new features to the Electron app
- Fixing bugs in the main or renderer process
- Modifying IPC communication patterns
- Making changes that involve cryptographic operations
- Refactoring code while maintaining security standards

**Configuration**: See `.github/agents/my-agent.agent.md` for full agent configuration.

## How to Use Copilot Agents

### In GitHub Issues
1. Assign an issue to `@copilot` or mention `@electron-app-assistant` in a comment
2. The agent will analyze the issue and propose changes
3. Review the pull request created by the agent
4. Iterate with the agent if needed by commenting on the PR

### In VS Code
1. Use the Copilot Chat interface
2. Mention `@electron-app-assistant` in your prompt
3. Ask questions or request changes related to the app

### In Pull Requests
1. Mention the agent in PR comments for review help
2. Ask for suggestions on specific changes
3. Request security review for cryptographic code

## Agent Guidelines

All agents in this repository:
- Follow JavaScript Standard Style
- Prioritize security for cryptographic operations
- Never log or expose private keys
- Validate all user input
- Use Electron security best practices
- Update documentation when making changes
- Run `npm run lint` before submitting code

## Creating New Agents

To create a new specialized agent:
1. Create a new file in `.github/agents/` with the `.agent.md` extension
2. Define the agent's name, description, and capabilities
3. Document what the agent should and shouldn't do
4. Add the agent to this AGENTS.md file
5. Test the agent with small tasks first

## Best Practices

- Be specific in your prompts to agents
- Provide context about what you're trying to accomplish
- Review agent changes carefully, especially security-critical code
- Use agents for tasks they specialize in
- Give feedback on agent performance to improve results

## Security Note

While agents are helpful, always review their changes to ensure:
- No private keys are logged or exposed
- Input validation is in place
- File operations are secure
- Electron security best practices are followed
- Dependencies don't introduce vulnerabilities

For more information on GitHub Copilot agents, see the [official documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents).
