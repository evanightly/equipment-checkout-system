<?php

namespace App\Actions\Shared;

use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

abstract class BaseQueryAction
{
    public static function execute(array $params, int $perPage = 15): LengthAwarePaginator
    {
        $instance = new static;

        // Child classes handle intent logic explicitly (CONSISTENT!)
        return $instance->executeDefault($params, $perPage);
    }

    protected function executeDefault(array $params, int $perPage): LengthAwarePaginator
    {
        return QueryBuilder::for($this->getModelClass())
            ->allowedFilters($this->getAllowedFilters())
            ->allowedIncludes($this->getAllowedIncludes())
            ->allowedSorts($this->getAllowedSorts())
            ->paginate($perPage);
    }

    // Configuration methods (implement in child classes)
    abstract protected function getModelClass(): string;

    abstract protected function getSearchableColumns(): array;

    abstract protected function getFilterableColumns(): array;

    protected function getRelationSearchableColumns(): array
    {
        return [];
    }

    protected function getRelationFilterableColumns(): array
    {
        return [];
    }

    protected function getIncludableRelations(): array
    {
        return [];
    }

    protected function getSortableColumns(): array
    {
        return ['id', 'created_at', 'updated_at'];
    }

    protected function getCustomFilters(): array
    {
        return [];
    }

    // Build filters automatically
    protected function getAllowedFilters(): array
    {
        $filters = [];

        // Search filter
        if (! empty($this->getSearchableColumns())) {
            $filters[] = AllowedFilter::partial('search', $this->getSearchableColumns());
        }

        // Exact filters
        foreach ($this->getFilterableColumns() as $column) {
            $filters[] = $column;
        }

        // Date range filter
        $filters[] = AllowedFilter::callback('created_between', function ($query, $value) {
            if (isset($value['from'])) {
                $query->where('created_at', '>=', $value['from']);
            }
            if (isset($value['to'])) {
                $query->where('created_at', '<=', $value['to']);
            }
        });

        // Relation search filters
        foreach ($this->getRelationSearchableColumns() as $relation => $columns) {
            $filters[] = AllowedFilter::callback("{$relation}_search", function ($query, $value) use ($relation, $columns) {
                $query->whereHas($relation, function ($q) use ($columns, $value) {
                    $q->where(function ($subQuery) use ($columns, $value) {
                        foreach ($columns as $column) {
                            $subQuery->orWhere($column, 'like', "%{$value}%");
                        }
                    });
                });
            });
        }

        // Relation array filters
        foreach ($this->getRelationFilterableColumns() as $paramKey => $config) {
            $relation = $config['relation'] ?? $paramKey;
            $column = $config['column'] ?? 'id';

            $filters[] = AllowedFilter::callback($paramKey, function ($query, $values) use ($relation, $column) {
                if (is_string($values)) {
                    $values = explode(',', $values);
                }
                $query->whereHas($relation, fn ($q) => $q->whereIn($column, (array) $values));
            });
        }

        return array_merge($filters, $this->getCustomFilters());
    }

    protected function getAllowedIncludes(): array
    {
        return $this->getIncludableRelations();
    }

    protected function getAllowedSorts(): array
    {
        return $this->getSortableColumns();
    }
}
