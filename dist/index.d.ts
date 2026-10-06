declare const Operator: {
    readonly equals: "equals";
    readonly notEquals: "notEquals";
    readonly lessThan: "lessThan";
    readonly lessThanEquals: "lessThanEquals";
    readonly greaterThan: "greaterThan";
    readonly greaterThanEquals: "greaterThanEquals";
    readonly contains: "contains";
    readonly notContains: "notContains";
    readonly in: "in";
    readonly notIn: "notIn";
    readonly matches: "matches";
    readonly notMatches: "notMatches";
    readonly between: "between";
    readonly notBetween: "notBetween";
    readonly isEmpty: "isEmpty";
    readonly notEmpty: "notEmpty";
    readonly exists: "exists";
    readonly notExists: "notExists";
    readonly startsWith: "startsWith";
    readonly endsWith: "endsWith";
};
type Operator = (typeof Operator)[keyof typeof Operator];
declare const ArrayOperator: {
    readonly all: "all";
    readonly any: "any";
    readonly none: "none";
    readonly atLeast: "atLeast";
    readonly atMost: "atMost";
    readonly exactly: "exactly";
    readonly empty: "empty";
    readonly notEmpty: "notEmpty";
};
type ArrayOperator = (typeof ArrayOperator)[keyof typeof ArrayOperator];
declare const DateOperator: {
    readonly before: "before";
    readonly after: "after";
    readonly onOrBefore: "onOrBefore";
    readonly onOrAfter: "onOrAfter";
    readonly notBefore: "notBefore";
    readonly notAfter: "notAfter";
    readonly within: "within";
    readonly notWithin: "notWithin";
    readonly between: "between";
    readonly notBetween: "notBetween";
    readonly dayIn: "dayIn";
    readonly dayNotIn: "dayNotIn";
};
type DateOperator = (typeof DateOperator)[keyof typeof DateOperator];

type FuzzyConfig = {
    maxDistance?: number;
    maxRatio?: number;
};
declare const maxFuzzyDistance: (length: number) => number;
declare const fuzzyContains: (haystack: string, query: string, config?: FuzzyConfig) => boolean;

declare const FieldKind: {
    readonly String: "String";
    readonly Boolean: "Boolean";
    readonly Int: "Int";
    readonly BigInt: "BigInt";
    readonly Float: "Float";
    readonly Decimal: "Decimal";
    readonly DateTime: "DateTime";
    readonly Json: "Json";
    readonly Bytes: "Bytes";
    readonly Enum: "Enum";
};
type FieldKind = (typeof FieldKind)[keyof typeof FieldKind];
declare const NUMERIC_KINDS: readonly FieldKind[];
declare const ORDERABLE_KINDS: readonly FieldKind[];
declare const STRINGY_KINDS: readonly FieldKind[];
declare const EQUATABLE_KINDS: readonly FieldKind[];
declare const ALL_KINDS: readonly FieldKind[];
declare const NULLABLE_KINDS: readonly FieldKind[];
declare const RuleTarget: {
    readonly check: "check";
    readonly toPrisma: "toPrisma";
    readonly toSql: "toSql";
};
type RuleTarget = (typeof RuleTarget)[keyof typeof RuleTarget];
declare const ValueShape: {
    readonly none: "none";
    readonly scalar: "scalar";
    readonly ordered: "ordered";
    readonly array: "array";
    readonly string: "string";
    readonly pattern: "pattern";
    readonly range: "range";
    readonly dateValue: "dateValue";
    readonly dateRange: "dateRange";
    readonly dateWindow: "dateWindow";
    readonly dayList: "dayList";
    readonly count: "count";
    readonly predicate: "predicate";
};
type ValueShape = (typeof ValueShape)[keyof typeof ValueShape];
type CatalogEntry = {
    kinds: readonly FieldKind[];
    targets: readonly RuleTarget[];
    valueShape: ValueShape;
    acceptsExpr?: boolean;
};
declare const FIELD_OPERATOR_CATALOG: Record<Operator, CatalogEntry>;
declare const DATE_OPERATOR_CATALOG: Record<DateOperator, CatalogEntry>;
type ArrayCatalogEntry = {
    targets: readonly RuleTarget[];
    valueShape: ValueShape;
};
declare const ARRAY_OPERATOR_CATALOG: Record<ArrayOperator, ArrayCatalogEntry>;
declare const WindowSupport: {
    readonly full: "full";
    readonly extremal: "extremal";
    readonly none: "none";
};
type WindowSupport = (typeof WindowSupport)[keyof typeof WindowSupport];
declare const WINDOW_SELECTOR: {
    readonly fields: readonly ["filter", "orderBy", "take", "skip"];
    readonly sortDirs: readonly ["asc", "desc"];
    readonly support: {
        readonly array: {
            readonly check: "full";
            readonly toPrisma: "extremal";
            readonly toSql: "none";
        };
        readonly aggregate: {
            readonly check: "full";
            readonly toPrisma: "none";
            readonly toSql: "none";
        };
    };
};
type WindowRuleType = keyof typeof WINDOW_SELECTOR.support;
declare const getWindowSupport: (ruleType: WindowRuleType, target: RuleTarget) => WindowSupport;
declare const AGGREGATE_OPERATORS: readonly Operator[];
/** The aggregate threshold comparisons `target` can compile — all of them when no
 *  target is given. The one source for both the validator's rejection and a builder's
 *  threshold picker, so neither has to restate which target drops which operator. */
declare const getAggregateOperators: (target?: RuleTarget) => readonly Operator[];
declare const isAggregateSingleOperator: (operator: Operator) => boolean;
declare const isAggregateRangeOperator: (operator: Operator) => boolean;
declare const getValueShape: (operator: Operator | DateOperator | ArrayOperator) => ValueShape;
declare const isOperatorSupportedForTarget: (operator: Operator | DateOperator | ArrayOperator, target: RuleTarget) => boolean;
declare const getOperatorsForKind: (kind: FieldKind, target?: RuleTarget) => {
    field: Operator[];
    date: DateOperator[];
};
declare const getArrayOperators: (target?: RuleTarget) => ArrayOperator[];

type OperatorValues = typeof Operator;
type ArrayOperatorValues = typeof ArrayOperator;
type DateOperatorValues = typeof DateOperator;
type RuleScalar = string | number | boolean | null | undefined;
type AggregateMode = 'sum' | 'avg';
type RuleValue = RuleScalar | Date | RegExp | RuleValue[] | {
    [key: string]: RuleValue;
};
type OrderedRuleValue = string | number | Date;
type DateInputValue = string | number | Date;
type RelativeUnits = {
    years?: number;
    quarters?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
};
type PeriodUnit = 'year' | 'quarter' | 'month' | 'week' | 'isoWeek' | 'day' | 'hour' | 'minute' | 'second';
type RollingExpr = {
    ago: RelativeUnits;
} | {
    ahead: RelativeUnits;
};
type PeriodExpr = {
    this: PeriodUnit;
} | {
    last: PeriodUnit;
} | {
    next: PeriodUnit;
};
type EdgeExpr = {
    start: PeriodExpr;
} | {
    end: PeriodExpr;
};
type DateExpr = RollingExpr | PeriodExpr | EdgeExpr;
type DateInputOrExpr = DateInputValue | DateExpr;
type DateRuleValue = DateInputValue | DateExpr | [DateInputOrExpr, DateInputOrExpr] | string[];
type WeekStart = 'monday' | 'sunday';
type TimeZoneConfig = string | {
    bind: string;
};
type DateConfig = {
    now?: DateInputValue;
    timeZone?: TimeZoneConfig;
    weekStart?: WeekStart;
};
type ValueSource<TValue> = {
    value: TValue;
    path?: never;
    bind?: never;
    bindOptional?: never;
} | {
    path: string;
    value?: never;
    bind?: never;
    bindOptional?: never;
} | {
    bind: string;
    bindOptional?: boolean;
    value?: never;
    path?: never;
};
type NoValueSource = {
    value?: never;
    path?: never;
};
type RuleBase<TOperator extends Operator> = {
    field: string;
    operator: TOperator;
    error?: string;
    caseInsensitive?: boolean;
    fuzzy?: boolean | FuzzyConfig;
};
type DateRuleBase<TOperator extends DateOperator> = {
    field: string;
    dateOperator: TOperator;
    error?: string;
};
type StrictEqualityRule<TValue = RuleValue> = (RuleBase<OperatorValues['equals']> & ValueSource<TValue>) | (RuleBase<OperatorValues['notEquals']> & ValueSource<TValue>);
type StrictOrderedComparisonRule = (RuleBase<OperatorValues['lessThan']> & ValueSource<OrderedRuleValue>) | (RuleBase<OperatorValues['lessThanEquals']> & ValueSource<OrderedRuleValue>) | (RuleBase<OperatorValues['greaterThan']> & ValueSource<OrderedRuleValue>) | (RuleBase<OperatorValues['greaterThanEquals']> & ValueSource<OrderedRuleValue>);
type StrictMembershipRule<TValue = RuleValue> = (RuleBase<OperatorValues['in']> & ValueSource<TValue[]>) | (RuleBase<OperatorValues['notIn']> & ValueSource<TValue[]>);
type StrictContainsRule<TValue = RuleValue> = (RuleBase<OperatorValues['contains']> & ValueSource<TValue>) | (RuleBase<OperatorValues['notContains']> & ValueSource<TValue>);
type StrictPatternRule = (RuleBase<OperatorValues['matches']> & ValueSource<RegExp | string>) | (RuleBase<OperatorValues['notMatches']> & ValueSource<RegExp | string>);
type StrictStringBoundaryRule = (RuleBase<OperatorValues['startsWith']> & ValueSource<string>) | (RuleBase<OperatorValues['endsWith']> & ValueSource<string>);
type StrictRangeRule = (RuleBase<OperatorValues['between']> & ValueSource<[OrderedRuleValue, OrderedRuleValue]>) | (RuleBase<OperatorValues['notBetween']> & ValueSource<[OrderedRuleValue, OrderedRuleValue]>);
type StrictPresenceRule = (RuleBase<OperatorValues['isEmpty']> & NoValueSource) | (RuleBase<OperatorValues['notEmpty']> & NoValueSource) | (RuleBase<OperatorValues['exists']> & NoValueSource) | (RuleBase<OperatorValues['notExists']> & NoValueSource);
type StrictRule<TValue = RuleValue> = StrictEqualityRule<TValue> | StrictOrderedComparisonRule | StrictMembershipRule<TValue> | StrictContainsRule<TValue> | StrictPatternRule | StrictStringBoundaryRule | StrictRangeRule | StrictPresenceRule;
type ArrayRuleBase<TOperator extends ArrayOperator> = {
    field?: string;
    arrayOperator: TOperator;
    error?: string;
};
type StrictArrayPredicateRule<TRuleValue = RuleValue, TDateValue = DateRuleValue> = (ArrayRuleBase<ArrayOperatorValues['all']> & {
    condition: StrictCondition<TRuleValue, TDateValue>;
    count?: never;
}) | (ArrayRuleBase<ArrayOperatorValues['any']> & {
    condition: StrictCondition<TRuleValue, TDateValue>;
    count?: never;
}) | (ArrayRuleBase<ArrayOperatorValues['none']> & {
    condition: StrictCondition<TRuleValue, TDateValue>;
    count?: never;
});
type StrictArrayCountRule<TRuleValue = RuleValue, TDateValue = DateRuleValue> = (ArrayRuleBase<ArrayOperatorValues['atLeast']> & {
    condition?: StrictCondition<TRuleValue, TDateValue>;
    count?: number;
}) | (ArrayRuleBase<ArrayOperatorValues['atMost']> & {
    condition?: StrictCondition<TRuleValue, TDateValue>;
    count?: number;
}) | (ArrayRuleBase<ArrayOperatorValues['exactly']> & {
    condition?: StrictCondition<TRuleValue, TDateValue>;
    count?: number;
});
type StrictArrayPresenceRule = (ArrayRuleBase<ArrayOperatorValues['empty']> & {
    condition?: never;
    count?: never;
}) | (ArrayRuleBase<ArrayOperatorValues['notEmpty']> & {
    condition?: never;
    count?: never;
});
type StrictArrayRule<TRuleValue = RuleValue, TDateValue = DateRuleValue> = StrictArrayPredicateRule<TRuleValue, TDateValue> | StrictArrayCountRule<TRuleValue, TDateValue> | StrictArrayPresenceRule;
type StrictDateComparisonRule = (DateRuleBase<DateOperatorValues['before']> & ValueSource<DateInputValue>) | (DateRuleBase<DateOperatorValues['after']> & ValueSource<DateInputValue>) | (DateRuleBase<DateOperatorValues['onOrBefore']> & ValueSource<DateInputValue>) | (DateRuleBase<DateOperatorValues['onOrAfter']> & ValueSource<DateInputValue>) | (DateRuleBase<DateOperatorValues['notBefore']> & ValueSource<DateInputValue>) | (DateRuleBase<DateOperatorValues['notAfter']> & ValueSource<DateInputValue>);
type StrictDateRangeRule = (DateRuleBase<DateOperatorValues['between']> & ValueSource<[DateInputValue, DateInputValue]>) | (DateRuleBase<DateOperatorValues['notBetween']> & ValueSource<[DateInputValue, DateInputValue]>);
type StrictDateDayRule = (DateRuleBase<DateOperatorValues['dayIn']> & {
    value: string[];
    path?: never;
}) | (DateRuleBase<DateOperatorValues['dayNotIn']> & {
    value: string[];
    path?: never;
});
type StrictDateRule = StrictDateComparisonRule | StrictDateRangeRule | StrictDateDayRule;
type AggregateRuleBase<TRuleValue = RuleValue, TDateValue = DateRuleValue> = {
    field: string;
    aggregate: {
        mode: AggregateMode;
        field?: string;
    };
    condition?: StrictCondition<TRuleValue, TDateValue>;
    error?: string;
};
type AggregateSingleOperator = OperatorValues['equals'] | OperatorValues['notEquals'] | OperatorValues['lessThan'] | OperatorValues['lessThanEquals'] | OperatorValues['greaterThan'] | OperatorValues['greaterThanEquals'];
type AggregateRangeOperator = OperatorValues['between'] | OperatorValues['notBetween'];
type StrictAggregateRule<TRuleValue = RuleValue, TDateValue = DateRuleValue> = (AggregateRuleBase<TRuleValue, TDateValue> & {
    operator: AggregateSingleOperator;
} & ValueSource<number>) | (AggregateRuleBase<TRuleValue, TDateValue> & {
    operator: AggregateRangeOperator;
} & ValueSource<[number, number]>);
type SortDir = 'asc' | 'desc';
type OrderBy = {
    field: string;
    dir: SortDir;
}[];
type WindowFields = {
    filter?: Condition;
    orderBy?: OrderBy;
    take?: number;
    skip?: number;
};
type AggregateRule<TRuleValue = RuleValue, TDateValue = DateRuleValue> = WindowFields & {
    field: string;
    aggregate: {
        mode: AggregateMode;
        field?: string;
    };
    condition?: Condition<TRuleValue, TDateValue>;
    operator: Operator;
    value?: number | [number, number];
    path?: string;
    bind?: string;
    bindOptional?: boolean;
    error?: string;
};
type Rule<TValue = RuleValue> = {
    field: string;
    operator: Operator;
    value?: TValue;
    path?: string;
    bind?: string;
    bindOptional?: boolean;
    error?: string;
    caseInsensitive?: boolean;
    fuzzy?: boolean | FuzzyConfig;
    coerceType?: FieldKind;
};
type ArrayRule<TRuleValue = RuleValue, TDateValue = DateRuleValue> = WindowFields & {
    field?: string;
    arrayOperator: ArrayOperator;
    condition?: Condition<TRuleValue, TDateValue>;
    count?: number;
    error?: string;
};
type DateRule<TValue = DateRuleValue> = {
    field: string;
    dateOperator: DateOperator;
    value?: TValue;
    path?: string;
    bind?: string;
    bindOptional?: boolean;
    error?: string;
};
type All<TRuleValue = RuleValue, TDateValue = DateRuleValue> = {
    all: Condition<TRuleValue, TDateValue>[];
    error?: string;
};
type Any<TRuleValue = RuleValue, TDateValue = DateRuleValue> = {
    any: Condition<TRuleValue, TDateValue>[];
    error?: string;
};
type IfThenElse<TRuleValue = RuleValue, TDateValue = DateRuleValue> = {
    if: Condition<TRuleValue, TDateValue>;
    then: Condition<TRuleValue, TDateValue>;
    else?: Condition<TRuleValue, TDateValue>;
    error?: string;
};
type Condition<TRuleValue = RuleValue, TDateValue = DateRuleValue> = Rule<TRuleValue> | AggregateRule<TRuleValue, TDateValue> | ArrayRule<TRuleValue, TDateValue> | DateRule<TDateValue> | All<TRuleValue, TDateValue> | Any<TRuleValue, TDateValue> | IfThenElse<TRuleValue, TDateValue> | boolean;
type StrictAll<TRuleValue = RuleValue, TDateValue = DateRuleValue> = {
    all: StrictCondition<TRuleValue, TDateValue>[];
    error?: string;
};
type StrictAny<TRuleValue = RuleValue, TDateValue = DateRuleValue> = {
    any: StrictCondition<TRuleValue, TDateValue>[];
    error?: string;
};
type StrictIfThenElse<TRuleValue = RuleValue, TDateValue = DateRuleValue> = {
    if: StrictCondition<TRuleValue, TDateValue>;
    then: StrictCondition<TRuleValue, TDateValue>;
    else?: StrictCondition<TRuleValue, TDateValue>;
    error?: string;
};
type StrictCondition<TRuleValue = RuleValue, TDateValue = DateRuleValue> = StrictRule<TRuleValue> | StrictAggregateRule<TRuleValue, TDateValue> | StrictArrayRule<TRuleValue, TDateValue> | StrictDateRule | StrictAll<TRuleValue, TDateValue> | StrictAny<TRuleValue, TDateValue> | StrictIfThenElse<TRuleValue, TDateValue> | boolean;

/** Names of every `{ bind }` token in the tree, optional or not — what a lens declares. */
declare const bindingNames: (condition: Condition) => Set<string>;
/**
 * Names a bindings map must cover: every `{ bind }` token not marked `bindOptional`. A
 * name that is optional at one leaf and required at another is required. An optional
 * name left unsupplied evaluates and compiles as `null`.
 */
declare const requiredBindings: (condition: Condition) => Set<string>;
/**
 * Substitute covered binds with their values; uncovered tokens stay in place (partial
 * resolution). A supplied-but-undefined binding becomes null to stay serializable.
 * Non-mutating.
 */
declare const resolveBindings: (condition: Condition, bindings: Record<string, RuleValue>) => Condition;

type Row$3 = Record<string, unknown>;
type CheckData = Row$3 | unknown[];
type CheckOptions = {
    context?: CheckData;
    bindings?: Record<string, RuleValue>;
} & DateConfig;
declare const check: <TData extends CheckData>(conditions: Condition, data: TData, options?: CheckOptions) => boolean | string;

type PrismaProvider = 'postgresql' | 'mysql' | 'sqlite' | 'sqlserver' | 'cockroachdb' | 'mongodb';
type EngineGlobalsState = {
    string: {
        caseInsensitive: boolean;
        fuzzy: boolean | FuzzyConfig;
    };
    prismaOptions: {
        datasource: {
            provider: PrismaProvider;
        };
    };
};
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
declare const engineGlobals: {
    set: (path: string, value: unknown) => void;
    get: (path: string) => unknown;
    reset: () => void;
    with: <T>(partial: DeepPartial<EngineGlobalsState>, fn: () => T) => T;
};
declare const supportsQueryMode: (provider: PrismaProvider) => boolean;
declare const resolveCaseInsensitive: (ruleFlag?: boolean) => boolean;
declare const resolveFuzzy: (ruleFlag?: boolean | FuzzyConfig) => FuzzyConfig | false;

type PrismaWhere = Record<string, unknown>;
/** A selectable option — the standard `<select>` shape: a value with an optional display
 * label, plus the partition keys (index-aligned with the source's `groupBy` axes)
 * when the source is grouped. */
type SourceOption = {
    value: string;
    label?: string;
    groups?: string[];
};
type FieldMapEntry = {
    kind: 'scalar' | 'object' | 'enum' | 'bridge';
    type: string;
    isList?: boolean;
    /**
     * Whether the column is NOT NULL. `toPrisma` reads this to decide if a negated
     * operator needs an explicit `equals: null` arm (Prisma's `not`/`notIn` follow SQL
     * three-valued logic and drop NULL rows); absent = unknown = no arm.
     */
    isRequired?: boolean;
    fromFields?: string[];
    toFields?: string[];
    relationName?: string;
    /**
     * Per-field allowed values, primarily for enum fields. Takes precedence over
     * `FieldMap.enums[type]` if both are set. Pass-through from codegen
     * (e.g. prisma-map's `EnumField.values`). Consumed by `checkRuleAgainstLens`.
     */
    values?: readonly string[];
    /**
     * A field's selectable option set as `{ value, label? }` pairs — the display
     * shape a picker consumes. On projection/surface output this is populated for
     * every value-gated field (enum members normalized to `{ value, label: value }`)
     * and for sourced fields (the fetched pairs from a materialized `SourceValues`).
     */
    options?: readonly SourceOption[];
    /**
     * Present on projection/surface output when the field's source partitions its
     * options: the dotted to-one axes (relative to this model) whose values are
     * each option's `groups`, index-aligned.
     */
    groupBy?: readonly string[];
};
type ModelEntry = {
    dbName?: string | null;
    fields: Record<string, FieldMapEntry>;
};
/**
 * A schema map: models keyed by name, plus an optional enum registry scoped to
 * this source. In multi-source setups (Prisma + Salesforce + CRM) each FieldMap
 * carries its own enums so namespaces don't collide across sources.
 */
type FieldMap = {
    models: Record<string, ModelEntry>;
    /** Enum name → allowed values, e.g. `{ UserRole: ['ADMIN', 'USER'] }`. */
    enums?: Record<string, readonly string[]>;
};
type StepRef = {
    __step: number;
};
type GroupByStep = {
    operation: 'groupBy';
    model: string;
    args: {
        by: string[];
        where: Record<string, unknown>;
        having: Record<string, unknown>;
    };
    extract: string;
};
type WhereStep = {
    operation: 'where';
    where: Record<string, unknown>;
};
type PrismaStep = GroupByStep | WhereStep;
type ToPrismaResult = {
    steps: PrismaStep[];
};
type BuildOptions = {
    map?: FieldMap | FieldMapSet;
    mapName?: string;
    model?: string;
    context?: Record<string, unknown>;
    datasource?: {
        provider?: PrismaProvider;
    };
} & DateConfig;

type BridgeEndpoint = {
    fieldMap: string;
    model: string;
    on: string;
};
type BridgeCardinality = 'oneToOne' | 'oneToMany';
/**
 * A cross-source edge between two endpoints.
 *
 * Endpoint ordering convention for `oneToMany`:
 *   - `endpoints[0]` is the "one" side — its `on` field must be unique per row
 *     (typically a primary key).
 *   - `endpoints[1]` is the "many" side — its `on` field may repeat across rows
 *     (typically a foreign key).
 *
 * Mis-ordering produces wrong `isList` flags during stitching and silent
 * row-dedup when building bridge dictionaries. `buildBridgeDictionary` throws
 * at runtime if endpoint[0]'s data has duplicate `on` values to catch this.
 *
 * For `oneToOne`, both `on` fields must be unique; endpoint order is symmetric.
 */
type Bridge = {
    endpoints: [BridgeEndpoint, BridgeEndpoint];
    cardinality: BridgeCardinality;
};
type FieldMapSet = {
    maps: Record<string, FieldMap>;
    bridges?: Bridge[];
};

type Row$2 = Record<string, unknown>;
type BridgeDictionary = Record<string, // map name
Record<string, // model name
Record<string, Record<string, Row$2 | Row$2[]>>>>;
declare const buildBridgeDictionary: (set: FieldMapSet, rawData: Record<string, Row$2[]>) => BridgeDictionary;

declare const stitchFieldMaps: (set: FieldMapSet) => FieldMapSet;

declare const validateFieldMapSet: (set: FieldMapSet) => void;
declare const validateFieldMap: (fieldMap: FieldMap, mapName?: string) => void;

type Lens = FieldMapSet & {
    mapName: string;
    model: string;
};
/**
 * Narrowing applied wherever a model appears (intrinsic to the model).
 * Has no `relations` because relations are path-specific by definition.
 *
 * Two kinds of narrowing live here:
 * - SCHEMA narrowing (picks/omits/enumPicks/enumOmits): controls what's visible
 *   in the type surface. AI/SDK consumers can't see narrowed-away fields.
 * - DATA narrowing (where): controls which ROWS are in scope. Filter-first
 *   semantic, anchored to the model. Under arrayOperator: 'all', applied via
 *   implication (negate) to preserve filter-first meaning — see applyLens.
 */
type ModelDefaultNarrowing = {
    picks?: string[];
    omits?: string[];
    enumPicks?: Record<string, readonly string[]>;
    enumOmits?: Record<string, readonly string[]>;
    /**
     * Row-level filter anchored to this model — "from what you can see, this is true."
     * Composes via filter-first semantic at every visit of this model.
     */
    where?: Condition;
    /**
     * Per-field eligibility over THIS model — decorates a field's option picker.
     * A bare `Condition` is the eligibility `where`: the field's selectable values =
     * DISTINCT(field) over this model filtered by `where` (plus the model's own
     * narrowing). A `SourceSpec` adds an optional `label` — a sibling column, or a
     * dotted to-one path ending on a scalar (like `groupBy`), co-selected as each
     * value's display label. Referenced-model option sets need no special form: declare
     * the source at a relation-traversed narrowing node and it compiles over whatever
     * model that path resolves to. The `where` composes AND-only across layers (general
     * via `mapDefaults`, path-specific via `root`/`relations`); a later layer's `label` wins.
     */
    sources?: Record<string, SourceValue>;
};
/**
 * A sourced field's eligibility `where` plus an optional display-label column — a
 * sibling, or a dotted to-one path ending on a scalar, resolved exactly like a
 * `groupBy` axis — and an optional `groupBy`: a dotted path (to-one hops only, ending
 * on a scalar) whose value partitions the option set. Grouped options carry `group`;
 * the classic flat set is the ungrouped case. At least one key is required — `{}` is not a
 * Condition; the unconstrained spelling is `true`.
 */
type SourceSpec = {
    where: Condition;
    label?: string;
    groupBy?: string | string[];
} | {
    where?: Condition;
    label: string;
    groupBy?: string | string[];
} | {
    where?: Condition;
    label?: string;
    groupBy: string | string[];
};
/** A `sources` entry: a bare eligibility `Condition`, or a richer `SourceSpec`. */
type SourceValue = Condition | SourceSpec;
/** Narrowing for a model at a specific traversal path. Adds relations to the default shape. */
type ModelNarrowing = ModelDefaultNarrowing & {
    relations?: Record<string, ModelNarrowing>;
};
/** Narrowing for an enum type (applies anywhere the enum is referenced). */
type EnumNarrowing = {
    picks?: readonly string[];
    omits?: readonly string[];
};
/** Applies-everywhere narrowings for one map — per-model (no relations) + per-enum-type. */
type NarrowingDefaults = {
    models?: Record<string, ModelDefaultNarrowing>;
    enums?: Record<string, EnumNarrowing>;
};
type LensNarrowing = {
    parent: Lens | LensNarrowing;
    /**
     * Path-specific narrowing anchored at (lens.mapName, lens.model). Descends via
     * `.relations` and may cross maps through bridge relations.
     */
    root?: ModelNarrowing;
    /**
     * Per-map applies-everywhere narrowings, keyed by map name. Apply wherever the
     * named model/enum appears in the visit being resolved.
     */
    mapDefaults?: Record<string, NarrowingDefaults>;
};

declare const applyLens: (rule: Condition, lensOrNarrowing: Lens | LensNarrowing) => Condition;

/**
 * Every bind name a lens (its whole narrowing chain) needs supplied to execute —
 * `bindOptional` tokens are not required (unsupplied, they resolve to null).
 * `parent:` references collapse to their base name — the caller supplies one value
 * per name and an inherited reference draws the same one. This is the "what does
 * this lens require" answer; pass `narrowing.parent` to see the names a child must
 * not collide with.
 */
declare const lensRequiredBindings: (lensOrNarrowing: Lens | LensNarrowing) => Set<string>;
/**
 * Preprocess a lens: resolve every `{ bind }` token the map covers in the chain's
 * `where`/`sources`, returning a structurally-new lens with concrete conditions.
 * Partial — uncovered tokens stay, so stages bind progressively. Once resolved,
 * `applyLens` / `toPrisma` / `toSql` / `sourceQueries` / `projectByPath` consume the
 * lens unchanged: a bind needs nothing new downstream. `parent:name` draws the same
 * value as the ancestor's `name`. Does not mutate the input.
 */
declare const resolveLensBindings: (lensOrNarrowing: Lens | LensNarrowing, bindings: Record<string, RuleValue>) => Lens | LensNarrowing;
/**
 * Bind names are unique across a composed chain: a layer may not re-declare a name
 * an ancestor already declares — rename it, or reference the inherited one read-only
 * as `parent:name`. A `parent:name` reference must point at a name some ancestor
 * actually declares. Returns the violation messages (folded into `validateNarrowing`).
 */
declare const validateBindNames: (narrowing: LensNarrowing) => string[];

type LensPathHop = {
    field: string;
    entry: FieldMapEntry;
    mapName: string;
    modelName: string;
    /** The relation path from the lens anchor to the model this hop reads. */
    relPath: string[];
};
/**
 * Where a dotted path lands through the lens, hop by hop. `hidden` is a field the model has but
 * the narrowing does not expose at this visit; `missing` is a field the model does not have (or a
 * model the map does not have); `pastScalar` is a segment after a scalar. A path that continues
 * below a Json column resolves at the column with the remainder in `jsonSubPath`.
 */
type LensPathResolution = {
    outcome: 'resolved';
    hops: LensPathHop[];
    terminal: LensPathHop;
    jsonSubPath: string[];
} | {
    outcome: 'hidden' | 'missing' | 'pastScalar';
    index: number;
    hops: LensPathHop[];
};

type RuleLensViolation = {
    path: string;
    reason: string;
};
type RuleLensCheck = {
    ok: boolean;
    violations: RuleLensViolation[];
};
declare const checkRuleAgainstLens: (rule: Condition, lensOrNarrowing: Lens | LensNarrowing) => RuleLensCheck;

type CreateLensInput = {
    maps: Record<string, FieldMap>;
    bridges?: Bridge[];
    mapName: string;
    model: string;
};
declare const createLens: (input: CreateLensInput) => Lens;

type RuleDescription = {
    sources: string[];
    bridgesCrossed: boolean;
    supportedTargets: RuleTarget[];
    violations: string[];
};
declare const describeRule: (rule: Condition, lensOrNarrowing: Lens | LensNarrowing) => RuleDescription;

type ProjectedVisit = {
    mapName: string;
    modelName: string;
    fields: Record<string, FieldMapEntry>;
    whereClauses: Condition[];
    /** Per-field source eligibility wheres, composed across layers (general + path). */
    sources: Record<string, Condition[]>;
    /** Per-field display label for a sourced field (from a SourceSpec's `label`): a sibling
     * column or a dotted to-one path. */
    sourceLabels: Record<string, string>;
    /** Per-field option-partition axes for a sourced field (from a SourceSpec's `groupBy`). */
    sourceGroupBys: Record<string, string[]>;
};
type PathProjection = Map<string, ProjectedVisit>;
/**
 * The materialized option set for one sourced field — the fetched companion to a
 * serializable lens. Its `options` are `{ value, label? }` pairs (the standard
 * `<select>` shape); it feeds both projections: `projectByPath` keys by
 * `path`+`field` (exact), `exposedSurface` by `mapName`+`model`+`field` (union).
 */
type SourceValues = {
    path: string;
    mapName: string;
    model: string;
    field: string;
    options: readonly SourceOption[];
};
type ProjectOptions = {
    sourceValues?: readonly SourceValues[];
};
declare const projectByPath: (lensOrNarrowing: Lens | LensNarrowing, opts?: ProjectOptions) => PathProjection;

declare const exposedSurface: (lensOrNarrowing: Lens | LensNarrowing, opts?: ProjectOptions) => Lens;

declare const validateNarrowing: (narrowing: LensNarrowing) => void;

/**
 * Resolve one dotted path through a lens, hop by hop, verifying as it walks: every hop is checked
 * against the narrowing at that visit, so a relation the narrowing dropped is `hidden`, a column the
 * model lacks is `missing`, and a segment past a scalar is `pastScalar`. This is the walk
 * `checkRuleAgainstLens` gates a rule's field with, exposed for consumers that resolve paths of their
 * own (template tokens, loop bindings, presence guards).
 */
declare const resolveLensPath: (lensOrNarrowing: Lens | LensNarrowing, path: string) => LensPathResolution;

/**
 * The values one rule compares at one declared source — keyed the way `projectByPath`
 * keys a source (`path` + `field`), so the caller can join it back to the source's
 * model without spelling a path of its own. A `mapDefaults`-declared source resolves
 * wherever its model appears, so `path` may name a relation chain the narrowing never
 * spelled under `root.relations`; the dotted format is the same.
 */
type RuleSourceValues = {
    path: string;
    mapName: string;
    model: string;
    field: string;
    /** Every literal a leaf at this source named; list operators flattened, deduped by content. */
    values: RuleValue[];
    /**
     * The set of values cannot be enumerated from literals: a leaf took its value from
     * `path` / `bind`, used an operator that describes values without naming them
     * (substring, pattern, range, date window), or used an operator the catalog does not
     * know. A caller deciding anything from `values` must fail closed.
     */
    dynamic: boolean;
};
/**
 * Which values a rule names at each source the lens declares — the lens owns the
 * vocabulary, so it answers questions about it; callers never spell a path. A leaf reaches a
 * source by its absolute path through the lens: nested (`{ field: 'orders', arrayOperator,
 * condition: { field: 'sku' } }`) and dotted (`{ field: 'orders.sku' }`) spellings are one path,
 * resolved by `walkLensPath` — visibility, `mapDefaults`, and the Json boundary all apply, so a
 * source declared in `mapDefaults` answers wherever its model appears. Quantifier-blind on
 * purpose — a `none` relation names its value as much as an `any` one, `notIn` as much as `in` —
 * but shape-aware via the operator catalog: only literal-naming shapes contribute `values`;
 * substring / pattern / range / window operators, and operators the catalog does not know, mark
 * the source `dynamic` instead of inventing values. A relation node's own comparison (an
 * aggregate's threshold, an array `count`) belongs to the node, not to a source. Paths invisible
 * under the lens, unmapped segments, and sub-paths beneath a Json column are silent.
 */
declare const ruleSourceValues: (lensOrNarrowing: Lens | LensNarrowing, rule: Condition) => RuleSourceValues[];

/** Prisma `select` shape — nested for a grouped source's relation path. */
type SourceSelect = {
    [field: string]: true | {
        select: SourceSelect;
    };
};
type SourcePrismaQuery = {
    model: string;
    /** Absent for grouped sources — DISTINCT on the value column alone would collapse
     * same-value rows across groups; dedup happens in `sourceValuesFromQueryRows`. */
    distinct?: string[];
    select: SourceSelect;
    where: PrismaWhere;
    /** Present only if the composed where used count operators (run via executePrismaQueryPlan). */
    steps?: PrismaStep[];
};
/** `sql` is null when the composed where uses a predicate SQL can't express
 * (e.g. array-condition operators); `error` then carries why. Prisma still
 * compiles — run that, or fall back to fetch + `check()`. */
type SourceSqlQuery = {
    sql: string | null;
    params: unknown[];
    error?: string;
};
type SourceQuery = {
    path: string;
    mapName: string;
    model: string;
    field: string;
    /** Co-selected as each value's display label (from a SourceSpec's `label`): a sibling
     * column, or a dotted to-one path like a groupBy axis — then selected nested in prisma
     * and aliased `__label` in sql. */
    label?: string;
    /** Option-partition axes (from a SourceSpec's `groupBy`, normalized); each axis
     * column is selected nested in prisma and aliased `__group_i` in sql. */
    groupBy?: string[];
    composedWhere: Condition;
    prisma: SourcePrismaQuery;
    sql: SourceSqlQuery;
};
/**
 * Compile a DISTINCT(value) query — Prisma and SQL — per sourced field across
 * the projected lens. The WHERE is the field's composed eligibility: the model's
 * own narrowing at that path AND its source where(s). The app runs these (with
 * its own client) to materialize each field's option set — feed the fetched rows
 * to `sourceValuesFromQueryRows`.
 */
declare const sourceQueries: (lensOrNarrowing: Lens | LensNarrowing) => SourceQuery[];

type Row$1 = Record<string, unknown>;
/** Which executor produced the rows — the caller always knows; never guessed. */
type SourceRowShape = 'prisma' | 'sql';
/**
 * Materialize one compiled `SourceQuery`'s fetched rows into its `SourceValues` —
 * the executor-side counterpart of `sourceQueries`, so apps never hand-map rows.
 * `rowShape` names the wire format: prisma rows (default) nest each `groupBy` axis
 * (and a dotted `label`) as related objects; sql rows carry them flat under the
 * statement's `__group_i` / `__label` aliases. Grouped queries fetch without
 * DISTINCT, so dedup per (groups, value) happens here.
 */
declare const sourceValuesFromQueryRows: (query: SourceQuery, rows: readonly Row$1[], opts?: {
    rowShape?: SourceRowShape;
}) => SourceValues;

type Row = Record<string, unknown>;
/**
 * Materialize each sourced field's option set from an already-fetched collection —
 * the in-memory executor of `sources` declarations, alongside `sourceQueries`
 * (which compiles the same declarations to DISTINCT queries for a DB). Rows are
 * the collection fetched UNDER the lens (relations inline), so they are already
 * lens-scoped: eligibility here is the field's source `where` only, evaluated via
 * `check()` (`options` feeds `{bind}` clauses). Scalar-list fields contribute one
 * option per element, labels take the first non-null value of the label column
 * (a sibling, or a dotted to-one path read through the nested rows), and sorting is
 * numeric-aware in a fixed locale. Feed the result to `exposedSurface` /
 * `projectByPath` as `{ sourceValues }`.
 */
declare const sourceValuesFromRows: (lensOrNarrowing: Lens | LensNarrowing, rows: readonly Row[], options?: CheckOptions) => SourceValues[];

declare const stampCoercions: (condition: Condition, lensOrNarrowing: Lens | LensNarrowing) => Condition;

type ScopeRef = {
    depth: number;
    path: string;
};
declare const parseScopeRef: (ref: string) => ScopeRef | null;
type ScopedRef<S> = {
    scope: S;
    path: string;
};
type ScopeOutOfBounds = {
    outOfBounds: string;
};
declare const resolveScopeRef: <S>(ref: string, scopes: readonly S[]) => ScopedRef<S> | ScopeOutOfBounds;

/**
 * Execute a Prisma query plan produced by toPrisma().
 *
 * The plan is a flat list of steps where all but the last are `groupBy` steps
 * that feed results (via { __step: N } sentinels) into subsequent steps.
 * The final step is always a `where` step whose resolved WHERE clause is returned.
 *
 * @param result         - Result from toPrisma()
 * @param prismaDelegate - Map of camelCase model name → Prisma delegate
 *                         e.g. { post: prisma.post, user: prisma.user }
 * @returns The resolved WHERE clause (ready for findMany/count/etc.)
 *
 * @example
 * const plan = toPrisma(condition, { map, model: 'User' });
 * const where = await executePrismaQueryPlan(plan, { post: prisma.post });
 * await prisma.user.findMany({ where });
 */
declare const executePrismaQueryPlan: (result: ToPrismaResult, prismaDelegate: Record<string, Record<string, (...args: unknown[]) => unknown>>) => Promise<Record<string, unknown>>;

/**
 * Convert a json-rules Condition to a Prisma query plan.
 *
 * Returns a `ToPrismaResult` with:
 * - `where` – the Prisma WHERE clause
 * - `steps` – optional array of groupBy steps for count-based relation filters
 *   (only present when `atLeast`/`atMost`/`exactly` operators are used with a map)
 *
 * When `steps` is present, pass the result to `executePrismaQueryPlan` to
 * resolve step refs before using `where` in a Prisma query.
 *
 * @param condition - The rule condition to convert
 * @param options   - Optional map, model, and context
 *
 * @example
 * ```typescript
 * // Simple scalar
 * toPrisma({ field: 'status', operator: Operator.equals, value: 'active' })
 * // → { where: { status: { equals: 'active' } } }
 *
 * // JSON field detection (map required)
 * toPrisma({ field: 'metadata.theme', operator: Operator.equals, value: 'dark' }, { map, model: 'User' })
 * // → { where: { metadata: { path: ['theme'], equals: 'dark' } } }
 *
 * // Context path ref
 * toPrisma({ field: 'userId', operator: Operator.equals, path: 'currentUser.id' }, { context: { currentUser: { id: '123' } } })
 * // → { where: { userId: { equals: '123' } } }
 *
 * // Multi-step (map required)
 * const plan = toPrisma({ field: 'posts', arrayOperator: 'atLeast', count: 3, condition: {...} }, { map, model: 'User' });
 * const where = await executePrismaQueryPlan(plan, { post: prisma.post });
 * await prisma.user.findMany({ where });
 * ```
 */
declare const toPrisma: (condition: Condition, options?: BuildOptions) => ToPrismaResult;

type SqlResult = {
    sql: string;
    params: unknown[];
    joins: string[];
};

type SqlBuildOptions = {
    map?: FieldMap;
    model?: string;
    alias?: string;
    context?: Record<string, unknown>;
} & DateConfig;
declare const toSql: (condition: Condition, options?: SqlBuildOptions) => SqlResult;

type ValidationIssue = {
    path: string;
    message: string;
    code: string;
};
type ValidationResult = {
    ok: boolean;
    errors: ValidationIssue[];
};
declare const validateRule: (condition: unknown, options?: {
    target?: RuleTarget;
}) => ValidationResult;
declare const assertValidRule: (condition: unknown, options?: {
    target?: RuleTarget;
}) => asserts condition is Condition;

export { AGGREGATE_OPERATORS, ALL_KINDS, ARRAY_OPERATOR_CATALOG, type AggregateMode, type AggregateRule, type All, type Any, type ArrayCatalogEntry, ArrayOperator, type ArrayRule, type Bridge, type BridgeCardinality, type BridgeDictionary, type BridgeEndpoint, type BuildOptions, type CatalogEntry, type CheckOptions, type Condition, type CreateLensInput, DATE_OPERATOR_CATALOG, type DateConfig, type DateExpr, type DateInputOrExpr, type DateInputValue, DateOperator, type DateRule, type DateRuleValue, EQUATABLE_KINDS, type EdgeExpr, type EngineGlobalsState, type EnumNarrowing, FIELD_OPERATOR_CATALOG, FieldKind, type FieldMap, type FieldMapEntry, type FieldMapSet, type FuzzyConfig, type GroupByStep, type IfThenElse, type Lens, type LensNarrowing, type LensPathHop, type LensPathResolution, type ModelDefaultNarrowing, type ModelNarrowing, NULLABLE_KINDS, NUMERIC_KINDS, type NarrowingDefaults, ORDERABLE_KINDS, Operator, type OrderBy, type OrderedRuleValue, type PathProjection, type PeriodExpr, type PeriodUnit, type PrismaProvider, type PrismaStep, type PrismaWhere, type ProjectOptions, type ProjectedVisit, type RelativeUnits, type RollingExpr, type Rule, type RuleDescription, type RuleLensCheck, type RuleLensViolation, type RuleScalar, type RuleSourceValues, RuleTarget, type RuleValue, STRINGY_KINDS, type ScopeOutOfBounds, type ScopeRef, type ScopedRef, type SortDir, type SourceOption, type SourcePrismaQuery, type SourceQuery, type SourceRowShape, type SourceSpec, type SourceSqlQuery, type SourceValue, type SourceValues, type SqlResult, type StepRef, type StrictAggregateRule, type StrictAll, type StrictAny, type StrictArrayCountRule, type StrictArrayPredicateRule, type StrictArrayPresenceRule, type StrictArrayRule, type StrictCondition, type StrictContainsRule, type StrictDateComparisonRule, type StrictDateDayRule, type StrictDateRangeRule, type StrictDateRule, type StrictEqualityRule, type StrictIfThenElse, type StrictMembershipRule, type StrictOrderedComparisonRule, type StrictPatternRule, type StrictPresenceRule, type StrictRangeRule, type StrictRule, type StrictStringBoundaryRule, type TimeZoneConfig, type ToPrismaResult, type ValidationIssue, type ValidationResult, ValueShape, WINDOW_SELECTOR, type WeekStart, type WhereStep, type WindowFields, type WindowRuleType, WindowSupport, applyLens, assertValidRule, bindingNames, buildBridgeDictionary, check, checkRuleAgainstLens, createLens, describeRule, engineGlobals, executePrismaQueryPlan, exposedSurface, fuzzyContains, getAggregateOperators, getArrayOperators, getOperatorsForKind, getValueShape, getWindowSupport, isAggregateRangeOperator, isAggregateSingleOperator, isOperatorSupportedForTarget, lensRequiredBindings, maxFuzzyDistance, parseScopeRef, projectByPath, requiredBindings, resolveBindings, resolveCaseInsensitive, resolveFuzzy, resolveLensBindings, resolveLensPath, resolveScopeRef, ruleSourceValues, sourceQueries, sourceValuesFromQueryRows, sourceValuesFromRows, stampCoercions, stitchFieldMaps, supportsQueryMode, toPrisma, toSql, validateBindNames, validateFieldMap, validateFieldMapSet, validateNarrowing, validateRule };
