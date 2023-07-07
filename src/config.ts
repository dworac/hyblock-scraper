import { ConfigVariable } from '@dworac/config';

class Config {
    @ConfigVariable(String)
    DISCORD_BOT_TOKEN!: string;

    @ConfigVariable(String)
    DISCORD_CLIENT_ID!: string;
}

const config = new Config();

export default config;
