export interface IDomainPersistenceMapper<TDomain, TDalEntity> {
    toPersistence(domainEntity: TDomain): TDalEntity;
    toDomain(raw: TDalEntity): TDomain;
}