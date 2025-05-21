# IBC-AI Protocol Review System

An AI-powered system for automating Institutional Biological and Chemical Safety Committee (IBC) protocol reviews, enhancing biosafety compliance and risk assessment processes.

## 🎯 Project Overview

The IBC-AI system streamlines the review process for biosafety protocols by:

- **Automated Document Processing**: Extract and analyze protocol information from PDF submissions
- **Risk Assessment**: Evaluate biological agents, procedures, and containment requirements
- **Regulatory Compliance**: Check against NIH Guidelines, CDC regulations, and institutional policies  
- **Knowledge Integration**: Leverage comprehensive biosafety databases and expert knowledge
- **Privacy-First Design**: Hybrid processing model for sensitive research information

## 🏗️ Architecture

### Core Components

- **FastAPI Backend**: RESTful API with async processing
- **PostgreSQL**: Primary data storage for protocols and metadata
- **Neo4j**: Knowledge graph for regulatory relationships
- **Weaviate**: Vector database for semantic search and document similarity
- **LangChain**: LLM orchestration for document analysis
- **Privacy Layer**: Hybrid local/external AI processing based on content sensitivity

### Domain-Driven Design

```
ibc_ai/
├── api/           # REST API endpoints and middleware
├── core/          # Cross-cutting concerns (logging, security)
├── config/        # Configuration management
├── domain/        # Business entities and domain logic
├── document/      # Document processing and analysis
├── knowledge/     # Biosafety knowledge base and regulations
├── data/          # Database repositories and models
└── services/      # Application services and orchestration
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.10+ (for local development)
- Git

### Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/IBC-AI.git
   cd IBC-AI
   ```

2. **Environment Configuration**
   ```bash
   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Start the Development Environment**
   ```bash
   # Build and start all services
   docker-compose up -d
   
   # Check service status
   docker-compose ps
   ```

4. **Access the Services**
   - **API Documentation**: http://localhost:8001/api/docs
   - **API Health Check**: http://localhost:8001/
   - **Neo4j Browser**: http://localhost:7475 (neo4j/password)
   - **Jupyter Notebooks**: http://localhost:8888
   - **Weaviate**: http://localhost:8080

## 📚 Usage

### API Endpoints

Once implemented, the system will provide:

```
POST /api/documents/upload     # Upload protocol documents
GET  /api/protocols/{id}       # Retrieve protocol details
POST /api/protocols/analyze    # Trigger AI analysis
GET  /api/protocols/{id}/risk  # Get risk assessment
GET  /api/knowledge/agents     # Browse biological agent database
```

### Document Processing Workflow

1. **Upload**: Submit protocol PDF through API
2. **Extract**: Parse text, identify sections, extract entities
3. **Analyze**: AI-powered risk assessment and compliance checking
4. **Review**: Generate structured review with recommendations
5. **Export**: Formatted reports for committee review

## 🛠️ Development

### Local Development Setup

```bash
# Install Poetry for dependency management
pip install poetry

# Install project dependencies
poetry install

# Activate virtual environment
poetry shell

# Run development server locally
uvicorn ibc_ai.main:app --reload --host 0.0.0.0 --port 8000
```

### Running Tests

```bash
# Run test suite
poetry run pytest

# Run with coverage
poetry run pytest --cov=ibc_ai --cov-report=html
```

### Code Quality

```bash
# Format code
poetry run black ibc_ai/ tests/

# Sort imports
poetry run isort ibc_ai/ tests/

# Type checking
poetry run mypy ibc_ai/

# Linting
poetry run flake8 ibc_ai/ tests/
```

## 🔒 Privacy & Security

### Hybrid Processing Model

- **Local Processing**: Sensitive content analyzed using local models
- **External APIs**: Non-sensitive analysis using OpenAI/Anthropic APIs
- **Content Classification**: Automatic sensitivity detection and routing
- **Data Minimization**: Only necessary information processed and stored

### Security Features

- Authentication and authorization
- Data encryption at rest and in transit
- Audit logging and compliance tracking
- Configurable data retention policies

## 📋 Implementation Status

### Phase 1: Foundation ✅
- [x] Development environment setup
- [x] Basic API structure
- [x] Database configuration
- [x] Docker containerization

### Phase 2: Core Features (In Progress)
- [ ] PDF document processing
- [ ] Entity extraction and analysis
- [ ] Basic risk assessment
- [ ] Knowledge base integration

### Phase 3: Advanced Features (Planned)
- [ ] Machine learning model training
- [ ] Advanced regulatory compliance
- [ ] Committee workflow integration
- [ ] Reporting and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📖 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **API Reference**: Generated from OpenAPI specification
- **Domain Models**: Business entity documentation
- **Configuration Guide**: Environment and deployment setup
- **Privacy Architecture**: Data handling and security measures

## 📧 Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/[username]/IBC-AI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/[username]/IBC-AI/discussions)
- **Email**: [contact@example.com]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔬 Research & Development

This project is part of ongoing research in AI-assisted biosafety compliance. Academic collaborations and research partnerships are welcome.

---

**Built with modern AI and biosafety expertise to enhance laboratory safety and regulatory compliance.**