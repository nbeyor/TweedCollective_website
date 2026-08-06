"""Protocol Strategist as a Gemini agent — ADK example.

This is the enterprise-Gemini integration path: an Agent Development Kit
(ADK) agent that consumes the Protocol Strategist remote MCP server over
Streamable HTTP. Deployed to Vertex AI Agent Engine, the agent can be
registered in Gemini Enterprise so employees reach it from the standard
Gemini surface.

Setup:
    pip install google-adk
    export STRATEGIST_MCP_URL="https://<your-site>/api/mcp"
    export STRATEGIST_MCP_KEY="<the MCP_API_KEY configured on the site>"

Local test:
    adk run .        # or `adk web` for the dev UI

Agent Engine deploy (then register the deployed agent in Gemini Enterprise):
    https://google.github.io/adk-docs/deploy/agent-engine/
"""

import os
from pathlib import Path

from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams

INSTRUCTIONS = (Path(__file__).parent / "AGENT_INSTRUCTIONS.md").read_text()

root_agent = LlmAgent(
    model="gemini-2.5-pro",
    name="protocol_strategist",
    description=(
        "Clinical trial design strategist grounded in an operations corpus. "
        "Pressure-tests protocol designs, runs sensitivity what-ifs, and "
        "publishes updated protocols to Google Drive."
    ),
    instruction=INSTRUCTIONS,
    tools=[
        MCPToolset(
            connection_params=StreamableHTTPConnectionParams(
                url=os.environ["STRATEGIST_MCP_URL"],
                headers={
                    "Authorization": f"Bearer {os.environ['STRATEGIST_MCP_KEY']}"
                },
                # ask_strategist runs a multi-round analysis loop server-side;
                # give tool calls room to finish.
                timeout=300,
            ),
            # Optional: narrow the surface, e.g. omit the Drive tools.
            # tool_filter=["ask_strategist", "get_started", "list_analyses",
            #              "build_chart_gallery"],
        )
    ],
)
