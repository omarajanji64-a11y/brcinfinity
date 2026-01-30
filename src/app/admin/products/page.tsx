       });
        } finally {
          setIsImporting(false);
          setCsvFile(null); 
        }
      },
      error: (error) => {
        console.error("PapaParse Error:", error);
        setIsImporting(false);
        setImportStatus('error');
        toast({
            variant: "destructive",
            title: t('admin_products.toast_import_error_title'),
            description: t('admin_products.toast_papa_parse_error_desc'),
        });
      },
    });
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-headline font-bold">{t('admin_nav.products')}</h1>
            <div className="flex items-center gap-4">
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('admin_products.add_product_button')}
            </Button>
            </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            <AiProductImporterCard />
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin_products.import_products_title')}</CardTitle>
                    <CardDescription>{t('admin_products.import_products_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-3">
                    <Label htmlFor="csv-import">{t('admin_products.csv_file_label')}</Label>
                    <div className="flex gap-2">
                        <Input id="csv-import" type="file" accept=".csv" onChange={handleFileChange} />
                        <Button onClick={handleImport} disabled={isImporting || !csvFile}>
                        {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {t('admin_products.import_button')}
                        </Button>
                    </div>
                    </div>
                </CardContent>
                {importStatus === 'success' && importedProductsPreview.length > 0 && (
                    <CardFooter>
                        <Alert variant="default">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>{t('admin_products.import_preview_title')}</AlertTitle>
                            <AlertDescription>
                                {t('admin_products.import_preview_success_desc', { count: importedProductsPreview.length })}
                            </AlertDescription>
                        </Alert>
                    </CardFooter>
                )}
                {importStatus === 'error' && (
                    <CardFooter>
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t('admin_products.toast_import_failed_title')}</AlertTitle>
                            <AlertDescription>
                                {t('admin_products.import_failed_desc')}</AlertDescription>
                        </Alert>
                    </CardFooter>
                )}
            </Card>
        </div>


        <Card>
            <CardHeader>
            <CardTitle>{t('admin_products.product_list_title')}</CardTitle>
            <CardDescription>{t('admin_products.product_list_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">{t('admin_products.table_header_image')}</TableHead>
                    <TableHead>{t('admin_products.table_header_name')}</TableHead>
                    <TableHead>{t('admin_products.table_header_category')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('admin_products.table_header_price')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('admin_products.table_header_stock')}</TableHead>
                    <TableHead>
                    <span className="sr-only">{t('admin_products.table_header_actions')}</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoadingProducts ? (
                    [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                    ))
                ) : (
                    products?.map((product) => {
                    const productName = product.name[language] ?? product.name['en'];
                    // Get first image from imageUrls array, or fallback to imageUrl for backward compatibility
                    const displayImageUrl = (product.imageUrls && product.imageUrls.length > 0) 
                      ? product.imageUrls[0] 
                      : product.imageUrl;
                    const isValidUrl = typeof displayImageUrl === 'string' && displayImageUrl.startsWith('https://');
                    return (
                        <TableRow key={product.id}>
                        <TableCell className="hidden sm:table-cell">
                            {isValidUrl ? (
                            <img
                                alt={productName}
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={displayImageUrl}
                                width="64"
                            />
                            ) : (
                            <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center">
                                <FileText className="h-6 w-6 text-muted-foreground"/>
                            </div>
                            )}
                        </TableCell>
                        <TableCell className="font-medium">{productName}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{product.category[language] ?? product.category['en']}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">${product.price.toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t('admin_products.actions_menu_label')}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(product)}>{t('common.edit')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">{t('common.delete')}</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    );
                    })
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        </div>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>{selectedProduct ? t('admin_products.edit_product_title') : t('admin_products.add_product_title')}</DialogTitle>
                <DialogDescription>
                    {selectedProduct ? t('admin_products.edit_product_desc') : t('admin_products.add_product_desc')}</DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto pr-6">
                <ProductForm product={selectedProduct} onSave={() => setIsFormOpen(false)} />
            </div>
        </DialogContent>
    </Dialog>
  );
}
