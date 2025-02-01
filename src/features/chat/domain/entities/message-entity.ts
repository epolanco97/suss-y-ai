export interface MessageEntity {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    codeBlocks?: CodeBlock[];
}

export interface CodeBlock {
    language: string;
    content: string;
}